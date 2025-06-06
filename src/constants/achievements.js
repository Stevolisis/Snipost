

export const Achievements = [
  // Snippet Achievements (13)
  {
    key: "first_snip",
    title: "🏅 First Snip",
    description: "You posted your first snippet!",
    xp: 15, // CHANGED: was 35
    category: "snippet"
  },
  {
    key: "active_poster",
    title: "🏅 Active Poster",
    description: "10 snippets posted!",
    xp: 40, // CHANGED: was 100
    category: "snippet"
  },
  {
    key: "upvoted_author",
    title: "🏅 Upvoted Author",
    description: "15 snippets with 15+ upvotes!",
    xp: 60, // CHANGED: was 150
    category: "snippet"
  },
  {
    key: "snippet_veteran",
    title: "🏅 Snippet Veteran",
    description: "50 public snippets!",
    xp: 80, // CHANGED: was 200
    category: "snippet"
  },
  {
    key: "fork_smith",
    title: "🏅 Fork Smith",
    description: "Forked 5 different snippets with each having 15+ upvotes",
    xp: 80, // CHANGED: was 200
    category: "snippet"
  },
  {
    key: "top_snip",
    title: "🏅 Top Snip",
    description: "50+ upvotes on a snippet!",
    xp: 50, // CHANGED: was 120
    category: "snippet"
  },
  {
    key: "forked_favorite",
    title: "🏅 Forked Favorite",
    description: "A single snippet forked 10+ times by others",
    xp: 80, // CHANGED: was 200
    category: "snippet"
  },
  {
    key: "tip_jar",
    title: "🏅 Tip Jar",
    description: "Receive tips on 3 different snippets",
    xp: 60, // CHANGED: was 150
    category: "snippet"
  },
  {
    key: "rising_snip",
    title: "🏅 Rising Snip",
    description: "One snippet gets 100+ upvotes",
    xp: 70, // CHANGED: was 160
    category: "snippet"
  },
  {
    key: "popular_creator",
    title: "🏅 Popular Creator",
    description: "One snippet gets 1000+ upvotes",
    xp: 100, // CHANGED: was 230
    category: "snippet"
  },
  {
    key: "viral_snip",
    title: "🏅 Viral Snip",
    description: "One snippet gets 10000+ upvotes",
    xp: 200, // CHANGED: was 1000 (massive reduction)
    category: "snippet"
  },
  {
    key: "js_commander",
    title: "🛠️ JS Commander",
    description: "10 JS/TS snippets with 5+ upvotes",
    xp: 60, // CHANGED: was 150
    category: "snippet"
  },
  {
    key: "rust_commander",
    title: "🛠️ Rust Commander",
    description: "10 Rust snippets with 5+ upvotes",
    xp: 60, // CHANGED: was 150
    category: "snippet"
  },

  // Comment Achievements (7)
  {
    key: "first_comment",
    title: "🏅 First Comment",
    description: "You posted your first comment!",
    xp: 12, // CHANGED: was 30
    category: "comment"
  },
  {
    key: "early_feedback",
    title: "🏅 Early Feedback",
    description: "First to comment on 5 snippets",
    xp: 40, // CHANGED: was 100
    category: "comment"
  },
  {
    key: "helpful_voice",
    title: "🏅 Helpful Voice",
    description: "One comment gets 10+ upvotes",
    xp: 40, // CHANGED: was 100
    category: "comment"
  },
  {
    key: "respected_insight",
    title: "🏅 Respected Insight",
    description: "A comment got 100+ upvotes!",
    xp: 100, // CHANGED: was 300
    category: "comment"
  },
  {
    key: "comment_legend",
    title: "🏅 Comment Legend",
    description: "A comment got 1000+ upvotes!",
    xp: 150, // CHANGED: was 300
    category: "comment"
  },
  {
    key: "community_helper",
    title: "🏅 Community Helper",
    description: "Post 25 comments on different snippets",
    xp: 100, // CHANGED: was 300
    category: "comment"
  },
  {
    key: "trusted_by_devs",
    title: "🏅 Trusted by Devs",
    description: "Receive replies from 10 different users",
    xp: 60, // CHANGED: was 150
    category: "comment"
  },

  // Engagement Achievements (4)
  {
    key: "30_day_flame",
    title: "🔥 30-Day Flame",
    description: "Engage daily for 30 days",
    xp: 120, // CHANGED: was 400
    category: "engagement"
  },
  {
    key: "100_day_flame",
    title: "🔥 100-Day Flame",
    description: "Engage daily for 100 days",
    xp: 200, // CHANGED: was 700
    category: "engagement"
  },
  {
    key: "500_day_flame",
    title: "🔥 500-Day Flame",
    description: "Engage daily for 500 days",
    xp: 300, // CHANGED: was 1000
    category: "engagement"
  },
  {
    key: "tipper",
    title: "💰 Tipper",
    description: "Tip 10 different users",
    xp: 40, // CHANGED: was 100
    category: "engagement"
  },

  // Profile & Social Achievements (8)
  {
    key: "complete_profile",
    title: "🏅 Complete Profile",
    description: "Add GitHub and Twitter Link, About, followedTags",
    xp: 20, // CHANGED: was 50
    category: "social"
  },
  {
    key: "og_snipper",
    title: "🏅 OG Snipper",
    description: "Join as one of the first 100 users",
    xp: 60, // CHANGED: was 150
    category: "social"
  },
  {
    key: "first_follower",
    title: "🏅 First Follower",
    description: "Gain your first follower",
    xp: 20, // CHANGED: was 50
    category: "social"
  },
  {
    key: "audience_builder",
    title: "🏅 Audience Builder",
    description: "Reach 20 followers",
    xp: 70, // CHANGED: was 180
    category: "social"
  },
  {
    key: "dev_to_watch",
    title: "🏅 Dev to Watch",
    description: "Reach 50 followers",
    xp: 100, // CHANGED: was 250
    category: "social"
  },
  {
    key: "trusted_voice",
    title: "🏅 Trusted Voice",
    description: "Reach 100 followers",
    xp: 150, // CHANGED: was 400
    category: "social"
  },
  {
    key: "influential_dev",
    title: "🏅 Influential Dev",
    description: "Reach 1000 followers",
    xp: 250, // CHANGED: was 700
    category: "social"
  },
  {
    key: "featured_builder",
    title: "🏅 Featured Builder",
    description: "Get featured on homepage",
    xp: 200, // CHANGED: was 700
    category: "social"
  }
];