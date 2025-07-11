"use client";

import "./global.css";
import NavBar from "@/components/navBar";
import { useThemeStore } from "@/store/themeStore";
import { Poppins } from "next/font/google";
import { useEffect, useState} from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "@/theme";
import SupportFloatingIcon from "@/components/supportFloatingIcon";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { theme } = useThemeStore();
  const currentTheme = theme === "dark" ? darkTheme : lightTheme;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <html lang="en">
      <head>
        <title>Task Management App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={poppins.className}>
        {mounted && (
        <ThemeProvider theme={currentTheme}>
          <CssBaseline /> 
          <NavBar />
          <SupportFloatingIcon/>
          <main>{children}</main>
        </ThemeProvider>
        )}
      </body>
    </html>
  );
}
