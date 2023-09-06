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
import { RefreshContext } from "./Context/Refresh";
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
  const SetTheme = (newTheme, onChange) => {
    document.body.classList.remove("dark", "light", "system");
    document.body.classList.add(newTheme);

    theme.current = newTheme;

    localStorage.setItem("theme", newTheme);

    if (theme.current === "system") {
      setIcon(() => <bs.BsFillDropletFill />);
    } else if (theme.current === "dark") {
      setIcon(() => <bs.BsFillMoonStarsFill />);
    } else if (theme.current === "light") {
      setIcon(() => <bs.BsFillSunFill />);
    }

    if (typeof onChange === "function") onChange(newTheme);
  };

  const [refresh, SetRefresh] = useState(undefined);

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
      mount.current = true;

      document.body.classList.add(theme.current);

      if (theme.current == null) {
        localStorage.setItem("theme", "system");
      }

      SetTheme(localStorage.getItem("theme"));

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

  return (
    <ThemeContext.Provider
      value={{
        theme: theme.current,
        Icon: themeIcon,
        setTheme: SetTheme,
      }}
    >
      {!load.remove && <Loader />}

      <LoaderContext.Provider value={{ ...loader }}>
        <RefreshContext.Provider
          value={{
            refresh,
            setRefresh: SetRefresh,
          }}
        >
          <LangContext.Provider value={SetLang}>
            <Header></Header>
          </LangContext.Provider>
          <Content>
            <Outlet />
          </Content>
          <Footer></Footer>
        </RefreshContext.Provider>
      </LoaderContext.Provider>
    </ThemeContext.Provider>
  );
}

Elen.propTypes = {
  use: PropTypes.object,
};
