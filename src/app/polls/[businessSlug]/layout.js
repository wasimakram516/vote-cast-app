"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function BusinessPollsLayout({ children }) {
  const router = useRouter();
  const { businessSlug } = useParams(); 

  useEffect(() => {
    if (businessSlug) {
      router.replace(`/polls/${businessSlug}/vote`);
    }
  }, [businessSlug, router]);

  return <>{children}</>;
}
