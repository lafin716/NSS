/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // 구글이미지 가져온 임시 hostname 등록
    domains: ["cdn2.hubspot.net", "localhost"],
  },
};
export default nextConfig;
