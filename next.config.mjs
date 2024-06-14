/** @type {import('next').NextConfig} */

const nextConfig = {
  // rewrites: [{ source: "/(.*)", destination: "/" }],
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
      // {
      //   source: "/(.*)", // 모든 경로에 대해 적용
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
    ];
  },
};

export default nextConfig;
