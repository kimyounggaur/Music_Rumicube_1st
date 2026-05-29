import type { NextConfig } from "next";

const isPagesBuild = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  typedRoutes: true,
  output: "export",
  trailingSlash: true,
  basePath: isPagesBuild ? "/Music_Rumicube_1st" : undefined,
  assetPrefix: isPagesBuild ? "/Music_Rumicube_1st/" : undefined
};

export default nextConfig;
