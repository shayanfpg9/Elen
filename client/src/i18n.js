import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => ({
  messages: {
    main: (await import(`./locales/${locale}/main.json`)).default,
    pages: (await import(`./locales/${locale}/pages.json`)).default,
    similar: (await import(`./locales/${locale}/similar.json`)).default,
  },
}));
