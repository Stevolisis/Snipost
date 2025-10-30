"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatPublishedDate } from "@/utils/formatPublishedDate";
import api from "@/utils/axiosConfig";
import { toast } from "sonner";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { loadDocsStart, loadDocsSuccess } from "@/lib/redux/slices/documentations";

const DocsLayout = ({ children }) => {
  const { docs, isLoading, error } = useAppSelector((state) => state.documentations);
  const { userData } = useAppSelector((state) => state.auth);
  const [scrollPosition, setScrollPosition] = useState(0);
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const companyUserName = params.username;
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchCompanyDocs = async () => {
      try {
        dispatch(loadDocsStart());
        const { data } = await api.get(`get-company-documentations/${userData._id}`);
        dispatch(loadDocsSuccess(data?.documentations || []));
      } catch (err) {
        console.log(err);
        dispatch(docsFailure(err?.response?.data?.message || "Failed to load documentations"));
        toast.error(err?.response?.data?.message || "Failed to load documentations");
      }
    };
    fetchCompanyDocs();
  }, [companyUserName, pathname, router]);

  const scrollLeft = () => {
    const container = document.getElementById("docs-scroll-container");
    if (container) {
      container.scrollLeft -= 300;
      setScrollPosition(container.scrollLeft - 300);
    }
  };

  const scrollRight = () => {
    const container = document.getElementById("docs-scroll-container");
    if (container) {
      container.scrollLeft += 300;
      setScrollPosition(container.scrollLeft + 300);
    }
  };


  return (
    <div className="w-full min-h-screen flex flex-col space-y-6 box-contain">
      {/* Horizontal Scrolling Docs List */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Company Documentation</h2>
          <div className="flex space-x-2">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-lg border border-zinc-800 hover:border-primary/50 hover:bg-zinc-800/30 transition-all"
            >
              <ChevronLeft className="h-4 w-4 text-zinc-400" />
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-lg border border-zinc-800 hover:border-primary/50 hover:bg-zinc-800/30 transition-all"
            >
              <ChevronRight className="h-4 w-4 text-zinc-400" />
            </button>
          </div>
        </div>

        <div
          className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 w-full md:w-[50vw]"
          id="docs-scroll-container"
        >
          {docs.map((doc) => (
            <Link
              key={doc._id}
              href={`/dev_org/${companyUserName}/documentations/${doc.slug}`}
              className={`flex-shrink-0 w-80 text-left p-4 rounded-xl border transition-all duration-200 ${
                pathname.endsWith(doc._id)
                  ? "border-primary bg-primary/10 text-white"
                  : "border-zinc-800 hover:border-primary/50 hover:bg-zinc-800/30 text-zinc-300"
              }`}
            >
              <h3 className="font-semibold text-base mb-2 line-clamp-1">
                {doc.title}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded capitalize">
                  {doc.templateId}
                </span>
                <span className="text-xs text-zinc-500">
                  {formatPublishedDate(doc.createdAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Active doc content */}
      <div className="">
        <Card className="bg-transparent w-full border-zinc-800">
          <CardContent className="p-0">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocsLayout;
