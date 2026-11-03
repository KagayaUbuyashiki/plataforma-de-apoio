import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Imagens de preview vêm do Supabase Storage (qualquer projeto *.supabase.co).
    // Em desenvolvimento, também aceita o Supabase local (`supabase start`, porta 54321).
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      ...(process.env.NODE_ENV === "development"
        ? [
            { protocol: "http" as const, hostname: "127.0.0.1", port: "54321" },
            { protocol: "http" as const, hostname: "localhost", port: "54321" },
          ]
        : []),
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: "3mb" },
  },
};

export default nextConfig;
