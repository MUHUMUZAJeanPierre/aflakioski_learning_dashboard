import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: ['reebelo.com', 'res.cloudinary.com'],
    },
    reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/auth/google/callback",
        destination: "/auth/callback",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
