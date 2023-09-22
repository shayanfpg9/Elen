import createIntlMiddleware from "next-intl/middleware";

export default createIntlMiddleware({
  locales: ["fa", "en"],
  defaultLocale: "en",
});

export const config = {
  matcher: ["/((?!api|_next|admin|.*\\..*).*)"],
};
