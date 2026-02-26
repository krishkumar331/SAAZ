import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Navbar } from "@/components/ui/navbar";
import { LocationProvider } from "@/contexts/location-context";
import { AuthProvider } from "@/contexts/auth-context";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ChatBot } from "@/components/ui/chat-bot";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "SAAZ - Art Meets Opportunity",
  description: "Bridge the gap between talented artists and clients seeking creative services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
            <AuthProvider>
              <LocationProvider>
                <SmoothScroll>
                  <Navbar />


                  <main className="">
                    {children}
                  </main>
                  <ChatBot />
                  <Toaster />
                </SmoothScroll>
              </LocationProvider>
            </AuthProvider>
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
