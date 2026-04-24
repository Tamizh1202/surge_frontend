/** @type {import('next').NextConfig} */

const payloadUrl = process.env.NEXT_PUBLIC_SERVER_URL;

const nextConfig = {
  images: {
    unoptimized: process.env.NODE_ENV !== "production",

    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: payloadUrl ? new URL(payloadUrl).protocol.replace(":", "") : "https",
        hostname: payloadUrl ? new URL(payloadUrl).hostname : "",
        port: payloadUrl ? new URL(payloadUrl).port : "",
      },
      {
        protocol: "https",
        hostname: "whitemantis-app.vercel.app",
      },
      {
        protocol: "https",
        hostname: "endpoint.whitemantis.ae",
      },
      {
        protocol: "https",
        hostname: "storage-admin-api.whitemantis.ae",
      },
    ],

  },
  // Empty turbopack config to silence Next.js 16 warning
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Handle canvas dependency for @react-pdf/renderer
    if (isServer) {
      config.externals = [...(config.externals || []), "canvas"];
    }
    return config;
  },
};

export default nextConfig;
