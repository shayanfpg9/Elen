import { getTranslator } from "next-intl/server";

export default async function generateMetadata(page, locale) {
  const t = await getTranslator(locale, "main");

  return {
    title: t("name") + " - " + t(`config.${page}`),
    description: t(`config.descriptions.${page}`),
    openGraph: {
      title: t("name") + " - " + t(`config.${page}`),
      description: t(`config.descriptions.${page}`),
    },
  };
}
