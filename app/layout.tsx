import "./globals.css";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Suspense, type ReactNode } from "react";
import CartSideBar from "../components/CartSideBar/CartSidebar";
import NextAuthProvider from "../components/SessionProvider";
// 1. Import both Providers
import { AuthProvider } from "./_context/AuthContext";
import { CartProvider } from "./_context/CartContext";
import { WishlistProvider } from "./_context/WishlistContext";
import { Toaster } from "react-hot-toast";
import AuthToast from "@/components/AuthToast/AuthToast";

export const metadata = {
  title: "Surge Coffee",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  let categories = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/web-categories?sort=createdAt&select[slug]=true&select[title]=true&select[image]=true&depth=2&limit=100`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );
    const data = await res.json();
    categories = data.docs || [];
  } catch (error) {
    console.error("Failed to fetch categories in layout:", error);
  }

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>

      <body suppressHydrationWarning>
        <NextAuthProvider>
          {/* 2. AuthProvider must be the parent of CartProvider */}
          <Toaster
            position="top-right"
            containerStyle={{
              top: 100,
              right: 24,
              zIndex: 9999,
            }}
          />
          <Suspense fallback={null}>
            <AuthToast />
          </Suspense>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Navbar categories={categories} />
                <main>{children}</main>
                <Footer categories={categories} />
                {/* 3. CartSideBar is now inside both providers */}
                <CartSideBar />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
