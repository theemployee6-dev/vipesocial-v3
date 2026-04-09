import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  allowedDevOrigins: ["192.168.15.*"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**", // permite qualquer caminho
      },
      // se você tiver outros hosts (ex: Uploadthing), adicione-os também
      {
        protocol: "https",
        hostname: "utfs.io", // caso use Uploadthing para vídeos
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
