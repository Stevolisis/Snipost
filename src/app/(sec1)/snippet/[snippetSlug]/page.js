// app/snippet/[snippetSlug]/page.js
import SnippetPageClient from "./SnippetPageClient";

async function fetchSnippet(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/get-snippet/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.snippet;
  } catch (err) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { snippetSlug } = await params; // ✅ correct in Next.js 15+
  const snippet = await fetchSnippet(snippetSlug);
  
  if (!snippet) {
    return {
      title: "Snippet Not Found | Snipost",
      description: "This snippet might have been removed or doesn’t exist.",
      openGraph: {
        title: "Snippet Not Found | Snipost",
        description: "This snippet might have been removed or doesn’t exist.",
        url: `https://snipost.dev/snippet/${snippetSlug}`,
        images: ["/og-image.png"],
      },
      twitter: {
        card: "summary_large_image",
        title: "Snippet Not Found | Snipost",
        description: "This snippet might have been removed or doesn’t exist.",
        images: ["/og-image.png"],
      },
    };
  }

  return {
    title: `${snippet.title} | Snipost`,
    description: snippet.description || "Explore this code snippet on Snipost.",
    openGraph: {
      title: snippet.title,
      description: snippet.description,
      url: `https://snipost.dev/snippet/${snippetSlug}`,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: snippet.title,
      description: snippet.description,
      images: ["/og-image.png"],
    },
  };
}

export default async function SnippetPage({ params }) {
  const { snippetSlug } = await params;
  const snippet = await fetchSnippet(snippetSlug);
  return <SnippetPageClient initialSnippet={snippet} params={{ snippetSlug }} />;
}