import "./globals.css";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import type { ReactNode } from "react";
import CartSideBar from '../components/CartSideBar/CartSidebar'
import NextAuthProvider from "../components/SessionProvider";

export const metadata = {
  title: "Surge Coffee",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>

      <body>
        <NextAuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
         
        </NextAuthProvider>
         <CartSideBar />
      </body>
    </html>
  );
}