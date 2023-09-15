//deps
import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

//styles
import "../styles/Main.scss";

//components
import Content from "./Content/Content";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";

//contexts
import Loader from "./Loader/Loader";
import { LoaderContext } from "./Context/loader";
import { ThemeContext } from "./Context/Theme";
import { LangContext } from "./Context/Lang";

//libs & utils
import DB from "./funcs/DB";
import { useTranslation } from "react-i18next";
import i18n from "../translate/i18n";
import useConfig from "./Hook/useConfig";
import * as bs from "react-icons/bs";

export const InitLoader = async () => {
  const stores = ["Atoms", "Single"];
  const init = await new DB().init(...stores);

  if (!localStorage.getItem("language")) {
    const langs = window.navigator.languages;

    if (langs.includes("fa")) {
      i18n.changeLanguage("fa");
    } else if (langs.includes("en")) {
      i18n.changeLanguage("en");
    }
  } else {
    i18n.changeLanguage(localStorage.getItem("language"));
  }

  if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "system");
  }

  if (init.length === stores.length) {
    return true;
  }

  return false;
};

export default function Elen(props) {
  const location = useLocation();
  const mount = useRef(false);

  const [load, setLoad] = useState({
    show: true,
    remove: false,
  });
  const loader = {
    hide: () => {
      setLoad({ remove: false });

      setTimeout(() => {
        setLoad({ remove: true });
        document.documentElement.style.overflowY = "visible";
      }, 500);
    },
    show: () => {
      document.documentElement.style.overflowY = "hidden";

      setLoad({ remove: false });
    },
  };

  const [themeIcon, setIcon] = useState();
  const theme = useRef(localStorage.getItem("theme"));
  const BehindTheme = useRef(localStorage.getItem("theme"));
  const SetTheme = (newTheme, automate = false) => {
    let MainThemeName = newTheme;

    if (newTheme === "system") {
      if (window.matchMedia) {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          MainThemeName = "dark";
        } else {
          MainThemeName = "light";
        }
      } else {
        MainThemeName = "dark";
      }
    }

    if (
      !automate ||
      (BehindTheme.current === "system" && MainThemeName !== theme.current)
    ) {
      document.body.classList.remove("dark", "light");
      document.body.classList.add(MainThemeName);

      theme.current = MainThemeName;
      BehindTheme.current = newTheme;

      localStorage.setItem("theme", newTheme);

      if (BehindTheme.current === "system") {
        setIcon(() => <bs.BsFillDropletFill />);
      } else if (BehindTheme.current === "dark") {
        setIcon(() => <bs.BsFillMoonStarsFill />);
      } else if (BehindTheme.current === "light") {
        setIcon(() => <bs.BsFillSunFill />);
      }

      if (mount.current) {
        console.log(
          `%c ${theme.current} `,
          `font-size: 0.8rem; text-transform: capitalize; font-family:helvetica; font-weight:bold; background-color: ${
            theme.current === "light" ? "white" : "navy"
          }; color:${theme.current !== "light" ? "white" : "navy"}`,
          "\nBehind theme: " + BehindTheme.current,
          "\nAppearance theme: " + theme.current
        );
      }
    }
  };

  const translate = useTranslation();
  const SetLang = (lang) => {
    if (["en", "fa"].includes(lang)) {
      document.documentElement.classList.remove("ltr", "rtl");

      const { i18n } = translate;

      i18n.changeLanguage(lang);

      if (lang === "en") {
        document.documentElement.classList.add("ltr");
      } else {
        document.documentElement.classList.add("rtl");
      }

      localStorage.setItem("language", lang);
    }
  };

  useEffect(() => {
    if (!mount.current) {
      SetTheme(localStorage.getItem("theme"));

      mount.current = true;

      if (!localStorage.getItem("language")) {
        const langs = window.navigator.languages;

        if (langs.includes("fa")) {
          SetLang("fa");
        } else if (langs.includes("en")) {
          SetLang("en");
        }
      } else {
        SetLang(localStorage.getItem("language"));
      }
    }
  });

  useConfig(loader);

  useMemo(() => {
    loader.show();
  }, [location]);

  const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  themeQuery.addEventListener("change", () => {
    if (BehindTheme.current === "system") {
      SetTheme("system", true);
    }
  });

  return (
    <ThemeContext.Provider
      value={{
        behind: BehindTheme.current,
        theme: theme.current,
        Icon: themeIcon,
        setTheme: SetTheme,
      }}
    >
      {!load.remove && <Loader />}

      <LoaderContext.Provider value={{ ...loader }}>
          <LangContext.Provider value={SetLang}>
            <Header></Header>
          </LangContext.Provider>
          <Content>{props.use ? props.use : <Outlet />}</Content>
          <Footer></Footer>
      </LoaderContext.Provider>
    </ThemeContext.Provider>
  );
}

Elen.propTypes = {
  use: PropTypes.object,
};
