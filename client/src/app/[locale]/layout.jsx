import { NextIntlClientProvider } from "next-intl";
import Content from "./components/content";
import Footer from "./components/footer";
import Header from "./components/header";
import "@/styles/Main.scss";
import RootLayout from "../components/temp";

export async function generateStaticParams() {
  return ["en", "fa"].map((locale) => ({ locale }));
}

export const metadata = {
  icons: {
    icon: "/logo.svg",
  },
  metadataBase: new URL("http://localhost:3000/"),
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      fa: "/fa",
    },
  },
};

async function Elen({ children, params: { locale } }) {
  if (["en", "fa"].includes(locale)) {
    const messages = {
      main: (await import(`../../locales/${locale}/main.json`)).default,
      pages: (await import(`../../locales/${locale}/pages.json`)).default,
      similar: (await import(`../../locales/${locale}/similar.json`)).default,
    };

    return (
      <RootLayout params={{ locale }}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <Content>{children}</Content>
          <Footer></Footer>
        </NextIntlClientProvider>
      </RootLayout>
    );
  }
}

export default Elen;
