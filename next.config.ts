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
  poweredByHeader: false,
  // Cabeçalhos de segurança em todas as páginas. (Uma CSP completa quebraria o
  // editor Monaco e a prévia ao vivo; frame-ancestors já impede clickjacking.)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
  experimental: {
    serverActions: { bodySizeLimit: "3mb" },
  },
};

export default nextConfig;
