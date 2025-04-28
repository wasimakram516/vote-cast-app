/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', 
  eslint: {
    ignoreDuringBuilds: true, 
  },
  images: {
    domains: ['res.cloudinary.com'], 
  },
  experimental: {
    serverActions: true, 
  },
};

export default nextConfig;
