import "./globals.css";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import type { ReactNode } from "react";
import CartSideBar from '../components/CartSideBar/CartSidebar'
import NextAuthProvider from "../components/SessionProvider";
// 1. Import both Providers
import { AuthProvider } from "./_context/AuthContext";
import { CartProvider } from "./_context/CartContext";

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
          {/* 2. AuthProvider must be the parent of CartProvider */}
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
              {/* 3. CartSideBar is now inside both providers */}
              <CartSideBar />
            </CartProvider>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}