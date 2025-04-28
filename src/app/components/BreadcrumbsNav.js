"use client";

import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import PollIcon from "@mui/icons-material/Poll";
import GroupIcon from "@mui/icons-material/Group";
import BarChartIcon from "@mui/icons-material/BarChart";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const segmentMap = {
  dashboard: {
    label: "Dashboard",
    icon: <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />,
  },
  businesses: {
    label: "Businesses",
    icon: <BusinessIcon fontSize="small" sx={{ mr: 0.5 }} />,
  },
  polls: {
    label: "Polls",
    icon: <PollIcon fontSize="small" sx={{ mr: 0.5 }} />,
  },
  "manage": {
    label: "Manage Polls",
    icon: <PollIcon fontSize="small" sx={{ mr: 0.5 }} />,
  },
  "results": {
    label: "Poll Results",
    icon: <BarChartIcon fontSize="small" sx={{ mr: 0.5 }} />,
  },
  users: {
    label: "Users",
    icon: <GroupIcon fontSize="small" sx={{ mr: 0.5 }} />,
  },
  games: {
    label: "Games",
    icon: <SportsEsportsIcon fontSize="small" sx={{ mr: 0.5 }} />,
  },
  questions: {
    label: "All Questions",
    icon: <HelpOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />,
  },
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const formatSegment = (seg) => {
  if (segmentMap[seg]) {
    const { icon, label } = segmentMap[seg];
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {icon}
        <span>{label}</span>
      </Box>
    );
  }
  return capitalize(seg.replace(/-/g, " "));
};

export default function BreadcrumbsNav() {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/").filter((seg) => seg && seg !== "cms");

  const paths = segments.map((seg, i) => ({
    segment: seg,
    href: "/cms/" + segments.slice(0, i + 1).join("/"),
  }));

  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          href="/cms"
          onClick={(e) => {
            e.preventDefault();
            router.push("/cms");
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <HomeIcon fontSize="small" sx={{ mr: 0.5 }} />
            Dashboard
          </Box>
        </Link>

        {paths.map((p, i) => {
          const segment = formatSegment(p.segment);
          const isLast = i === paths.length - 1;

          return isLast ? (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                color: "text.primary",
                fontWeight: "bold",
              }}
            >
              {segment}
            </Box>
          ) : (
            <Link
              key={i}
              underline="hover"
              color="inherit"
              href={p.href}
              onClick={(e) => {
                e.preventDefault();
                router.push(p.href);
              }}
              sx={{ display: "flex", alignItems: "center" }}
            >
              {segment}
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}
