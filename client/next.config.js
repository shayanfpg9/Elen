const { join } = require("path");
const withIntl = require("next-intl/plugin")("./src/i18n.js");

/** @type {import('next').NextConfig} */
const nextConfig = withIntl({
  // async rewrites() {
  //   return [
  //     // {
  //     //   source: "/:locale/:path",
  //     //   destination: "/:locale/:path*",
  //     // },

  //     // {
  //     //   source: "/admin/:path*",
  //     //   destination: "/admin/:path*",
  //     //   locale: false,
  //     // },

  //     {
  //       source: "/api/:slug*",
  //       destination: "http://localhost:4000/:slug*",
  //     },
  //   ];
  // },

  sassOptions: {
    includePaths: [join(__dirname, "src/styles")],
  },
});

module.exports = nextConfig;
