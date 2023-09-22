import "@/styles/Main.scss";
import StyledComponentsRegistry from "@/lib/styled-components";
import { Vazirmatn, Roboto } from "next/font/google";
import Provider from "./provider";

const vazir = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--font",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
  variable: "--font",
});

export default function RootLayout({ children, params: { locale } }) {
  const DefaulTheme = typeof window !== "undefined" ? theme : "light";

  return (
    <html lang={locale}>
      <body
        className={`${
          locale === "fa" ? vazir.variable : roboto.variable
        } ${DefaulTheme}`}
      >
        <StyledComponentsRegistry>
          <Provider DefaulTheme={DefaulTheme}>{children}</Provider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
