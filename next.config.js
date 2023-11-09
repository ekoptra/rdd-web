/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@nivo"],
  experimental: { esmExternals: "loose", appDir: false },
  output: "standalone",
  webpack: (config) => {
    config.module.rules.unshift({
      test: /pdf\.worker\.(min\.)?js/,
      type: "asset/resource",
      generator: {
        filename: "static/worker/[hash][ext][query]"
      }
    });

    return config;
  }
};

module.exports = nextConfig;
