"use client";

import Navbar from "@/app/components/Navbar";
import { Box } from "@mui/material";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/cms/polls/results/full");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Box sx={{ pt: hideNavbar ? 0 : 5 }}>
        {children}
      </Box>
    </>
  );
}
