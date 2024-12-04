/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", "fit.huit.edu.vn"], // Thêm domain ảnh bạn cần sử dụng
  },
};

module.exports = nextConfig;
