"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTop({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({
        top: 0,
        behavior: "smooth", // optional
    });
  }, [pathname]);

  return <>{children}</>;
}
