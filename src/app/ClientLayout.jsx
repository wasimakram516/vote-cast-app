"use client";

import Navbar from "@/app/components/Navbar";
import { Box } from "@mui/material";
import { useParams, usePathname } from "next/navigation";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const { businessSlug } = useParams(); 
  const hideNavbar = pathname.startsWith(`/polls/${businessSlug}/results`);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Box sx={{ pt: hideNavbar ? 0 : 5 }}>
        {children}
      </Box>
    </>
  );
}
