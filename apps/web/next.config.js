/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Disable type checking during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint during build (optional)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
