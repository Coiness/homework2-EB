import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 配置允许来自远程主机的图片 —— 避免 next/image 因未经允许的 hostname 报错
  // 我们的本地 mock / 示例数据使用了 cdn.example.com 和 placehold.co
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.example.com" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
};

export default nextConfig;
