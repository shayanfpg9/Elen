//deps
import { useContext, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

//libs & utils
import { useTranslation } from "react-i18next";
import * as bs from "react-icons/bs";
import { LangContext } from "../Context/Lang";

//contexts
import { ThemeContext } from "../Context/Theme";

export default function Menu(props) {
  const search = props.SearchBoxClick;
  const MenuRef = useRef();
  const dis = props.status ? 0 : "calc(-1 * var(--menu-width))";
  const { behind, setTheme, Icon } = useContext(ThemeContext);
  const handleLang = useContext(LangContext);
  const { t, i18n } = useTranslation("menu");
  const { language } = i18n;
  const blur = useRef();
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
      icon: bs.BsSpeedometer,
      link: {
        element: Link,
        props: { to: "/panel" },
      },
      text: t("panel"),
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
    {
      icon: bs.BsBookHalf,
      link: {
        element: Link,
        props: { to: "/document" },
      },
      text: t("document"),
    },
  ];
  const location = useLocation();

  const Mount = useRef(false);

  useMemo(() => {
    if (props.status) props.function();
  }, [location]);

  useEffect(() => {
    if (!Mount.current) {
      Mount.current = true;
    }

    blur.current.onclick = () => {
      blur.current.onclick = undefined;
      props.function();
    };

    document.querySelectorAll("menu button").forEach((btn) => {
      btn.onclick = () => {
        props?.function();
      };
    });
  }, [props]);

  const { pathname } = useLocation();

  const Search = () => {
    try {
      navigator.share({
        title: document.title,
        text: document
          .querySelector("meta[name~='description']")
          .getAttribute("content"),
        url: window?.location.href,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div ref={blur} className={props.status ? "blur" : "hide"}></div>
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
              className="header__menu-item"
              onClick={props.function}
              title={item.text}
              key={item.text}
            >
              <item.link.element
                {...item.link.props}
                className={
                  (
                    item?.link?.props?.to === "/docuemnt"
                      ? pathname.includes("/document")
                      : pathname === item?.link?.props?.to
                  )
                    ? "active"
                    : ""
                }
              >
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

          <button
            type="button"
            title={`${t("icons.theme")} (${behind})`}
            onClick={() => {
              if (behind === "system") setTheme("dark");
              else if (behind === "dark") setTheme("light");
              else if (behind === "light") setTheme("system");
            }}
          >
            {Icon}
          </button>

          <button type="button" title={t("icons.share")} onClick={Search}>
            <bs.BsShareFill />
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
    </>
  );
}
