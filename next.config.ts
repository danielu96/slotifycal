import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'ohzyszlnufwlavkjhyfu.supabase.co',
      },
    ],

  },
};

export default nextConfig;
