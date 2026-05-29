import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PawPrint Auth",
  description: "Animal Rescue & Lost Pet Platform",
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-pawprint-dark`}>
         <Providers>
           {children}
         </Providers>
      </body>
    </html>
  );
}
