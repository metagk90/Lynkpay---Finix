/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
   async redirects() {
      return [
        {
          source: "/",
          destination: "https://lynkpay.co",
          permanent: false,
        },
      ]
    },
}

export default nextConfig
