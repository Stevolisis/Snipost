"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { toast } from "sonner";
import { FileText, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DocsDefaultPage() {
  const router = useRouter();
  const { username } = useParams();
  const { docs, isLoading } = useAppSelector((state) => state.documentations);


  useEffect(() => {
    if (!isLoading && docs.length > 0) {
      router.replace(`/dev_org/${username}/documentations/${docs[0].slug}`);
    } else if (!isLoading && docs.length === 0) {
      toast.info("No documentations found.");
    }
  }, [docs, isLoading, username, router]);

  // Loading state (compact and responsive)
  if (isLoading) {
    return (
      <div className="w-full min-h-[55vh] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Loading documentation...</p>
        </div>
      </div>
    );
  }

  // Empty state responsive UI
  if (!isLoading && docs.length === 0) {
    return (
          <Card className="bg-transparen border-0">
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No documentations yet</h3>
              <p className="text-zinc-400">
                This company hasn’t published any documentation. Create your first
                documentation to help your team and users.
              </p>
            </CardContent>
          </Card>
    );
  }

  // Default fallback (very short)
  return (
    <div className="w-full min-h-[40vh] flex items-center justify-center px-4">
      <p className="text-sm text-muted-foreground">Redirecting...</p>
    </div>
  );
}
