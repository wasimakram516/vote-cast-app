import "./styles/globals.css";
import ThemeRegistry from "@/app/styles/themeRegistry";
import { MessageProvider } from "@/app/context/MessageContext";
import { AuthProvider } from "@/app/context/AuthContext";
import ClientLayout from "@/app/ClientLayout";
import { Box } from "@mui/material";

export const metadata = {
  title: "VoteCast – WhiteWall",
  description:
    "VoteCast by WhiteWall lets businesses run sleek, branded, real-time polls with media-rich options and anonymous voting. Built for engagement, designed for simplicity.",
  keywords:
    "VoteCast, Poll App, Real-Time Voting, Anonymous Polls, Interactive Polls, Business Polling Platform, WhiteWall Digital Solutions",
  author: "WhiteWall Digital Solutions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#033649" />
        <link rel="icon" href="/votecast-icon.png" type="image/png" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
      </head>
      <body>
        <ThemeRegistry>
          <AuthProvider>
            <MessageProvider>
              <ClientLayout>{children}</ClientLayout>
            </MessageProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
