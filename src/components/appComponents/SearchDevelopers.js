"use client";
import React, { useState } from "react";
import {
  Github,
  Twitter,
  Linkedin,
  Globe,
  Search,
  Laptop,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const platforms = [
  { name: "GitHub", icon: Github },
  { name: "X (Twitter)", icon: Twitter },
  { name: "LinkedIn", icon: Linkedin },
  { name: "Snipost", icon: Globe },
];

const dummyDevelopers = [
  {
    name: "Ada Lovelace",
    platform: "GitHub",
    avatar: "https://i.pravatar.cc/100?img=1",
    bio: "Full-stack engineer passionate about AI, blockchain, and open source.",
    url: "https://github.com/",
  },
  {
    name: "John Doe",
    platform: "LinkedIn",
    avatar: "https://i.pravatar.cc/100?img=2",
    bio: "Frontend developer specializing in React, Next.js, and modern UI systems.",
    url: "https://linkedin.com/",
  },
  {
    name: "Sophia Carter",
    platform: "X (Twitter)",
    avatar: "https://i.pravatar.cc/100?img=3",
    bio: "Tech content creator and software engineer exploring Web3 & DevTools.",
    url: "https://twitter.com/",
  },
  {
    name: "Ethan Brooks",
    platform: "Snipost",
    avatar: "https://i.pravatar.cc/100?img=4",
    bio: "Developer advocate sharing code snippets and tutorials on Snipost.",
    url: "https://snipost.com/",
  },
  {
    name: "Liam Johnson",
    platform: "GitHub",
    avatar: "https://i.pravatar.cc/100?img=5",
    bio: "Backend engineer with focus on Node.js, APIs, and database performance.",
    url: "https://github.com/",
  },
];

const SearchDevelopers = () => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("GitHub");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const filtered = dummyDevelopers.filter((dev) =>
        dev.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.length ? filtered : dummyDevelopers);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="pt-8 bg-background text-foreground">
      <Card className="bg-card border border-border shadow-md rounded-2xl">
        <CardContent className="p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 text-xl font-semibold">
              <Search className="w-5 h-5 text-primary" />
              <h2>Search Developers to Hire</h2>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex  items-center gap-3">
            <Input
              placeholder="Search by name, skills, GitHub, X handle, etc..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground flex-1 h-10 px-4 sm:h-12 sm:px-4 text-base"
            />
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-4 sm:h-12 sm:px-6 font-medium"
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Platform Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {platforms.map((p) => (
              <button
                key={p.name}
                onClick={() => setSelected(p.name)}
                className={`flex items-center justify-center gap-2 rounded-lg sm:rounded-xl border transition-all w-full h-[40px] sm:h-[50px] text-sm font-medium ${
                  selected === p.name
                    ? "bg-primary text-primary-foreground border-transparent"
                    : "bg-muted border-border hover:border-primary"
                }`}
              >
                <p.icon className="w-4 h-4" />
                {p.name}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="bg-muted/40 border border-border rounded-2xl p-6 min-h-[250px] overflow-y-auto max-h-[500px]">
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-12 space-y-3">
                <Laptop className="w-10 h-10 text-muted-foreground" />
                <h3 className="text-lg font-medium">Discover Talented Developers</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Search across GitHub, X, LinkedIn, and Snipost to find developers
                  with the skills you need. View profiles, portfolios, and more.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {results.map((dev, i) => (
                  <div
                    key={i}
                    onClick={() => window.open(dev.url, "_blank")}
                    className="bg-card border border-border hover:border-primary rounded-xl p-4 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between h-full"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={dev.avatar || "/default_avatar.png"}
                        alt={dev.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-sm">{dev.name}</h4>
                        <p className="text-xs text-muted-foreground">{dev.platform}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
                      {dev.bio}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchDevelopers;
