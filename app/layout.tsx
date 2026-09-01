import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteTitle = "Chukwuduzie Blaise — Backend Engineer, Distributed Systems & Fintech";
const siteDescription =
  "Backend engineer building scalable distributed systems, with deep specialty in fintech and payments infrastructure. Working in Node.js, TypeScript, PostgreSQL, and Java.";

export const metadata: Metadata = {
  metadataBase: new URL("https://chukwuduzie-blaise.vercel.app"),
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: "/avatar.jpg",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "https://chukwuduzie-blaise.vercel.app",
    siteName: "Chukwuduzie Blaise",
    type: "website",
    images: [
      {
        url: "/avatar.jpg",
        width: 781,
        height: 908,
        alt: "Chukwuduzie Blaise - Backend Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/avatar.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plexSans.variable} ${plexMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
