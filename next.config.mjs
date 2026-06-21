/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        // pathname: '/account123/**',
      }
    ]
  }
};

export default nextConfig;
