/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "utfs.io",
            port: "",
          },
        ],
      },
    
};

export default nextConfig;
