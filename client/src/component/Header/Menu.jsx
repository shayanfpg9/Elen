import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as bs from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { LangContext } from "../Context/Lang";
import { RefreshContext } from "../Context/Refresh";
import { ThemeContext } from "../Context/Theme";

export default function Menu(props) {
  const search = props.SearchBoxClick;
  const MenuRef = useRef();
  const dis = props.status ? 0 : "calc(-1 * var(--menu-width))";
  const { setRefresh } = useContext(RefreshContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const [ThemeIcon, setThemeIcon] = useState(<bs.BsFillDropletFill />);
  const handleLang = useContext(LangContext);
  const { t, i18n } = useTranslation("menu");
  const { language } = i18n;
  const items = [
    {
      icon: bs.BsHouseFill,
      link: {
        element: Link,
        props: { to: "/" },
      },
      text: t("home"),
    },
    {
      icon: bs.BsTable,
      link: {
        element: Link,
        props: { to: "/table" },
      },
      text: t("table"),
    },

    {
      icon: bs.BsBinocularsFill,
      link: {
        element: "button",
        props: { onClick: search, type: "button" },
      },
      text: t("search"),
    },
  ];

  useEffect(() => {
    window.onkeyup = ({ code }) => {
      if (code === "Escape" && props.status) {
        window.onkeyup = undefined;
        props.function();
      }
    };

    if (theme === "system") {
      setThemeIcon(<bs.BsFillDropletFill />);
    } else if (theme === "dark") {
      setThemeIcon(<bs.BsFillMoonStarsFill />);
    } else if (theme === "light") {
      setThemeIcon(<bs.BsFillSunFill />);
    }
  }, [setThemeIcon, props, theme]);

  const { pathname } = useLocation();

  return (
    <menu
      ref={MenuRef}
      style={{ [language === "en" ? "right" : "left"]: dis }}
      className={`header__menu`}
    >
      <i
        className="header__menu-icon fibo-1--sq close"
        onClick={props.function}
      >
        <bs.BsXLg />
      </i>

      {items.map((item) => {
        return (
          <li
            className="header__menu-item fibo-1--sq"
            onClick={props.function}
            title={item.text}
            key={item.text}
          >
            <item.link.element {...item.link.props}>
              <item.icon />
              {item.text}
            </item.link.element>
          </li>
        );
      })}

      <li className="header__menu-item fibo-1--sq icons">
        <a
          href="https://github.com/shayanfpg9/elen"
          target="_blank"
          title={t("icons.github")}
          rel="noreferrer"
          onClick={props.function}
        >
          <bs.BsGithub />
        </a>

        {pathname.match(/(table|atom)/gi) && (
          <button
            type="button"
            title={t("icons.refresh")}
            onClick={() => {
              props.function();
              setRefresh(true);
            }}
          >
            <bs.BsCapslockFill />
          </button>
        )}

        <button
          type="button"
          title={`${t("icons.theme")} (${theme})`}
          onClick={() => {
            if (theme === "system") setTheme("dark");
            else if (theme === "dark") setTheme("light");
            else if (theme === "light") setTheme("system");
          }}
        >
          {ThemeIcon}
        </button>

        <button
          type="button"
          title={`${t("icons.lang")} (${language})`}
          onClick={() => {
            if (language === "en") handleLang("fa");
            else if (language === "fa") handleLang("en");
          }}
        >
          {language === "en" ? "fa" : "en"}
        </button>
      </li>
    </menu>
  );
}
