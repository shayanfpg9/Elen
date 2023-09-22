"use client";

//deps
import { useContext, useEffect, useMemo, useRef, useState } from "react";

//libs & utils
import * as bs from "react-icons/bs";
import { useLocale, useTranslations } from "next-intl";

//contexts
import { ThemeContext } from "@/context/theme";
import useNavigate from "@/app/hooks/useNavigate";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Menu(props) {
  const navigate = useNavigate();
  const search = props.SearchBoxClick;
  const MenuRef = useRef();
  const dis = props.status ? 0 : "calc(-1 * var(--menu-width))";
  const { behind, setTheme, Icon } = useContext(ThemeContext);
  const t = useTranslations("main.menu");
  const language = useLocale();
  const blur = useRef();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const items = [
    {
      icon: bs.BsHouseFill,
      link: {
        element: Link,
        props: { href: "/" },
      },
      text: t("home"),
    },
    {
      icon: bs.BsSpeedometer,
      link: {
        element: Link,
        props: { href: "/panel" },
      },
      text: t("panel"),
    },
    {
      icon: bs.BsTable,
      link: {
        element: Link,
        props: { href: "/table" },
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
        props: { href: "/document" },
      },
      text: t("document"),
    },
  ];

  const [Mount, setMount] = useState(false);

  useMemo(() => {
    if (props.status) props.function();
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!Mount) {
      setMount(true);
    }

    if (typeof props.status !== "undefined") {
      if (props.status) {
        document.documentElement.style.overflow = "hidden";
      } else {
        document.documentElement.removeAttribute("style");
      }
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

  const Share = () => {
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
                  pathname.startsWith(item?.link?.props?.href) ? "active" : ""
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

          <button type="button" title={t("icons.share")} onClick={Share}>
            <bs.BsShareFill />
          </button>

          <button
            type="button"
            title={`${t("icons.lang")} (${language})`}
            onClick={() => {
              if (language === "en") Mount && navigate("fa", "locale");
              else if (language === "fa") Mount && navigate("en", "locale");
            }}
          >
            {language === "en" ? "fa" : "en"}
          </button>
        </li>
      </menu>
    </>
  );
}
