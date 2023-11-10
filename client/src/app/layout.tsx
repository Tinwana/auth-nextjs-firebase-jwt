"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import "./globals.css";
import Header from "@/components/header/Header";
import { persist, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { devNull } from "os";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };
type ReduxProviderProps = {
  children: React.ReactNode;
};
interface RefreshTokenResponse {
  status: string;
  message: string;
  access_token: string;
}

function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Auth App</title>
      </head>
      <body className={`dark:bg-slate-600 ${inter.className} overflow-hidden`}>
        <ReduxProvider>
          <PersistGate persistor={persist} loading={null}>
            <Header />
            {children}
          </PersistGate>
        </ReduxProvider>
      </body>
    </html>
  );
}
