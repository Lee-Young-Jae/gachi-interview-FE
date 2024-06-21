/** @type {import('next').NextConfig} */

const nextConfig = {
  // rewrites: [{ source: "/(.*)", destination: "/" }],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "inf-video.s3.ap-northeast-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "gachi-myeonjeob.s3.ap-northeast-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
    ],
  },
  async headers() {
    return [
      // {
      //   source: "/interview/:slug*",
      //   headers: [
      //     {
      //       key: "Cross-Origin-Embedder-Policy",
      //       value: "require-corp",
      //     },
      //     {
      //       key: "Cross-Origin-Opener-Policy",
      //       value: "same-origin",
      //     },
      //   ],
      // },
      // {
      //   source:
      //     "/_next/static/chunks/_app-pages-browser_node_modules_ffmpeg_ffmpeg_dist_esm_worker_js.js",
      //   headers: [
      //     {
      //       key: "Cross-Origin-Embedder-Policy",
      //       value: "require-corp",
      //     },
      //     {
      //       key: "Cross-Origin-Resource-Policy",
      //       value: "cross-origin",
      //     },
      //   ],
      // },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless", //credentialless 요청을 허용하기
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          // {
          //   key: "Content-Security-Policy",
          //   value: "upgrade-insecure-requests",
          // },
        ],
      },
    ];
  },
};

export default nextConfig;
