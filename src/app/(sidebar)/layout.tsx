import "../../css/satoshi.css";
import '../../css/style.css';
import { SessionProvider } from "@/context/SessionContext";
import { Sidebar } from "@/components/Layouts/sidebar";

//import "flatpickr/dist/flatpickr.min.css";
// import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    template: "%s | ZMX Chatbot",
    default: "ZMX Chatbot",
  },
  description:
    "ZMX Chatbot for managing ZMX Users through whatsapp",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
          <Providers>
            <NextTopLoader color="#12AA4E" showSpinner={false} />

            <div className="flex min-h-screen">
              <Sidebar />

              <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
                <Header />

                <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                  {children}
                </main>
              </div>
            </div>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
