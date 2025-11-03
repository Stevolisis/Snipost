"use client";
import { useEffect } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { usePathname, useRouter } from "next/navigation";

const RouteProtector = ({children}) => {
    const { userData } = useAppSelector((state) => state.auth);
    const router = useRouter();
    const pathname = usePathname();
    
    useEffect(() => {
        // Wait until Redux state is hydrated
        if (!userData) return;
        if (pathname.includes("dev_org")) return;

        if (userData.role !== "company") {
            router.replace(`/feed/snippets`);
        }
    }, [userData, router]);


  return children;
}

export default RouteProtector