import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "192.168.15.*",
    "uninterpretively-objurgative-nerissa.ngrok-free.dev",
  ],
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
    ],
  },
};

export default nextConfig;
