import { NextResponse } from "next/server";



async function fetchRepoStats(repos, username, headers) {
  const results = [];
  const chunkSize = 5; // limit concurrency to avoid rate-limit

  for (let i = 0; i < repos.length; i += chunkSize) {
    const chunk = repos.slice(i, i + chunkSize);

    const chunkResults = await Promise.allSettled(
      chunk.map(async (repo) => {
        const [pulls, issues, langs] = await Promise.all([
          fetch(
            `https://api.github.com/repos/${username}/${repo.name}/pulls?state=all&per_page=50`,
            { headers }
          ).then((r) => r.json()),

          fetch(
            `https://api.github.com/repos/${username}/${repo.name}/issues?state=all&per_page=50`,
            { headers }
          ).then((r) => r.json()),

          fetch(repo.languages_url, { headers }).then((r) => r.json()),
        ]);

        return {
          repo: repo.name,
          description: repo.description,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          watchers: repo.watchers_count,
          pullRequestCount: Array.isArray(pulls) ? pulls.length : 0,
          issueCount: Array.isArray(issues) ? issues.length : 0,
          languages: langs, // { JavaScript: 12345, Rust: 4567 }
        };
      })
    );

    results.push(
      ...chunkResults
        .map((r) => (r.status === "fulfilled" ? r.value : null))
        .filter(Boolean)
    );
  }

  return results;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    console.log("GitHub OAuth code:", code);

    // 🔑 Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenRes.json();
    console.log("GitHub token data:", tokenData);

    if (tokenData.error) {
      return NextResponse.json(tokenData, { status: 400 });
    }

    const accessToken = tokenData.access_token;
    const headers = { Authorization: `Bearer ${accessToken}` };

    // 🔹 Fetch user profile
    const userRes = await fetch("https://api.github.com/user", { headers });
    const user = await userRes.json();
    const username = user.login;

    // 🔹 Fetch emails
    const emailRes = await fetch("https://api.github.com/user/emails", {
      headers,
    });
    const emails = await emailRes.json();

    // 🔹 Fetch repos
    const repoRes = await fetch(
      "https://api.github.com/user/repos?per_page=50&sort=updated",
      { headers }
    );
    const repos = await repoRes.json();

    // 🔹 Fetch per-repo stats
    const results = await fetchRepoStats(repos, username, headers);

    // 🔹 Aggregate totals
    const totals = results.reduce(
      (acc, repo) => {
        acc.totalStars += repo.stars;
        acc.totalForks += repo.forks;
        acc.totalWatchers += repo.watchers;
        acc.totalPRs += repo.pullRequestCount;
        acc.totalIssues += repo.issueCount;

        // count languages globally
        for (const [lang, bytes] of Object.entries(repo.languages)) {
          acc.languages[lang] = (acc.languages[lang] || 0) + bytes;
        }
        return acc;
      },
      {
        totalStars: 0,
        totalForks: 0,
        totalWatchers: 0,
        totalPRs: 0,
        totalIssues: 0,
        languages: {},
      }
    );

    return NextResponse.json({
      accessToken,
      user,
      emails,
      totals,
      results, // per-repo details
    });
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error verifying GitHub auth" },
      { status: 500 }
    );
  }
}
