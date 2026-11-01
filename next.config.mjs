/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Listings can point at Unsplash, imgbb, or any host the host pastes in.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
