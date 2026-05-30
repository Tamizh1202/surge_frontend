import "./globals.css";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Suspense, type ReactNode } from "react";
import CartSideBar from "../components/CartSideBar/CartSidebar";
import NextAuthProvider from "../components/SessionProvider";
import { AuthProvider } from "./_context/AuthContext";
import { CartProvider } from "./_context/CartContext";
import { WishlistProvider } from "./_context/WishlistContext";
import { Toaster } from "react-hot-toast";
import AuthToast from "@/components/AuthToast/AuthToast";
import PageLoader from "@/components/PageLoader/PageLoader";
import LenisProvider from "@/components/LenisProvider/LenisProvider";

export const metadata = {
  title: "Surge Coffee",

  verification: {
    google: "ORL_aJZtRjuc6Ipv8As036lXgWwZzpj8moWZxbDPmrQ",
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://surge-backend-seven.vercel.app';

  let categories = [];
  try {
    const res = await fetch(
      `${serverUrl}/api/web-categories?sort=createdAt`,
      { next: { revalidate: 3600 } },
    );
    const data = await res.json();
    categories = data.docs || [];
  } catch (error) {
    console.error("Failed to fetch categories in layout:", error);
  }

  let shops = [];
  try {
    const res = await fetch(
      `${serverUrl}/api/shop?limit=100&sort=createdAt`,
      { next: { revalidate: 3600 } },
    );
    const data = await res.json();
    shops = data.docs || [];
  } catch (error) {
    console.error("Failed to fetch shops in layout:", error);
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
        <LenisProvider>
        <NextAuthProvider>
          {/* 2. AuthProvider must be the parent of CartProvider */}
          <Toaster
            position="top-right"
            containerStyle={{
              top: 100,
              right: 24,
              zIndex: 9999,
            }}
            toastOptions={{
              style: {
                fontFamily: 'var(--font-raleway)',
              },
            }}
          />
          <Suspense fallback={null}>
            <AuthToast />
          </Suspense>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Navbar categories={categories} />
                <Suspense fallback={<PageLoader />}>
                  <main>{children}</main>
                </Suspense>
                <Footer categories={categories} shops={shops} />
                {/* 3. CartSideBar is now inside both providers */}
                <CartSideBar />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </NextAuthProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
