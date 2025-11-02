"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateUserData } from "@/lib/redux/slices/auth";
import api from "@/utils/axiosConfig";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Star,
  Users,
  Coins,
  FileText,
  Laptop,
  RefreshCw,
  UserPlus,
  Trophy,
} from "lucide-react";
import SearchDevelopers from "@/components/appComponents/SearchDevelopers";
import Recents from "@/components/appComponents/RecentDocumentations";
import { loadSnippetsStart, loadSnippetsSuccess, snippetsFailure } from "@/lib/redux/slices/snippets";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { userData, jwtToken } = useAppSelector((state) => state.auth);
  const isOwner = userData?._id;
  const { snippets } = useAppSelector((state) => state.snippets);
  const { earned } = useAppSelector((state) => state.profile);
  const [comments, setComments] = useState([]);
  const [docs, setDocs] = useState([]);

  const fetchSnippets = async () => {
    try {
      dispatch(loadSnippetsStart())
      const response = await api.get(`/get-user-snippets/${isOwner}?limit=5`)
      const snippets = response.data.snippets || []
      dispatch(loadSnippetsSuccess(snippets))
    } catch (err) {
      dispatch(snippetsFailure(err.message || 'Failed to load snippets'))
    }
  }
  
  const fetchDocs = async () => {
    if (!isOwner) return
    
    try {
      const response = await api.get(`get-company-documentations/${isOwner}`)
      setDocs(response.data.documentations || [])
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
      toast.error('Failed to load transaction history')
    }
  }

  const fetchUser = async () => {
    const loadingId = toast.loading("Loading company data...");
    try {
      const { data } = await api.get("/company/me", {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      dispatch(updateUserData(data.user));
    } catch (err) {
      console.log(err);
      const msg =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg, { id: loadingId });
    } finally {
      toast.dismiss(loadingId);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await api.get(`/get-recent-comments?limit=7`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      console.log("Fetched comments:", response.data.comments);
      setComments(response.data.comments || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      toast.error("Failed to load recent comments");
    }
  };

  useEffect(() => {
    if (jwtToken) {
      fetchUser();
      fetchComments();
    }
  }, [jwtToken, dispatch]);

  useEffect(() => {
    fetchSnippets();
  }, [isOwner]);

  useEffect(() => {
    fetchDocs();
  }, [isOwner]);

  const stats = [
    {
      label: "Total Views",
      value: "0",
      change: "",
      icon: Eye,
    },
    {
      label: "Total Bounties",
      value: "0",
      change: "",
      icon: Trophy,
    },
    {
      label: "Followers",
      value: userData?.followers?.length || "0",
      change: "",
      icon: Users,
    },
    {
      label: "Earned (SOL)",
      value: earned?.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2) || "0.00",
      change: "",
      icon: Coins,
    },
  ];

  const actions = [
    {
      icon: FileText,
      title: "Create Documentation",
      subtitle: "Start with a template",
      href: "/docs/create_documentation",
    },
    {
      icon: Laptop,
      title: "Add Code Example",
      subtitle: "Share practical code",
      href: "/docs/create_example",
    },
    {
      icon: RefreshCw,
      title: "Post Update",
      subtitle: "Changelog or news",
      href: "/docs/create_update",
    },
    {
      icon: Trophy,
      title: "Create Bounties",
      subtitle: "Promote your tool through bounties",
      href: "#",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-row justify-between sm:items-center mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium"
          asChild
        >
          <Link href="/docs/create_documentation">+ New Content</Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card
              key={i}
              className="py-2 bg-muted/30 border border-border hover:border-primary/60 hover:shadow-md transition"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-primary/10 p-3">
                    <Icon className="text-primary w-5 h-5" />
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mt-3">
                  {stat.value}
                </h2>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-green-500 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <Link key={i} href={action.href} className="group">
              <Card className="h-44 flex items-center justify-center border-dashed border-2 group-hover:border-primary transition-all duration-200 group-hover:shadow-md">
                <CardContent className="flex flex-col items-center justify-center text-center p-4">
                  <Icon className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  <h3 className="font-semibold text-sm sm:text-base">
                    {action.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {action.subtitle}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
      <SearchDevelopers/>

      <Recents 
        fetchSnippets={fetchSnippets} 
        snippets={snippets} 
        comments={comments} 
        docs={docs} 
        fetchDocs={fetchDocs}
        jwtToken={jwtToken}
      />
    </div>
  );
};

export default Dashboard;