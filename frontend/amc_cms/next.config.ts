import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // すべてのAPIルートにCORSヘッダーを付与
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // ローカル用
          },
          // {
          //   key: "Access-Control-Allow-Origin",
          //   value: `${process.env.FRONT_END_URL}`, // ローカル用
          // },
          // {
          //   key: "Access-Control-Allow-Origin",
          //   value: "https://aqua-medical-c.com", // 本番用
          // },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
