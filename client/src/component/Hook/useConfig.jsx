//deps
import { useEffect, useMemo, useRef, useState } from "react";

//libs & utils
import { useTranslation } from "react-i18next";
import {
  isRouteErrorResponse,
  useLocation,
  useNavigate,
  useParams,
  useRouteError,
} from "react-router-dom";
import chroma from "chroma-js";

export default function useConfig(loader) {
  const mount = useRef(false);
  const navigate = useNavigate();
  const [lastLocation, setNewLocation] = useState(undefined);
  const location = useLocation();
  const { t, i18n } = useTranslation("config");
  const name = useTranslation().t("name");
  const params = useParams();
  const error = useRouteError();
  const paths = {
    home: "/",
    info: "/atom/",
    search: "/table/find",
    table: "/table",
    TableResult: "/table/find/",
    document: "/document",
  };

  let page = "";

  const setTitle = () => {
    document.title = name + " - " + t(page);

    switch (
      page //with special params
    ) {
      case "info":
        document.title += ` (${params.atom})`;
        break;

      case "TableResult" && params.query:
        document.title += ` (${params.query})`;
        break;

      case "document":
        document.title += " -> /" + (params.action || params.method || "");
        break;

      default:
        break;
    }
  };

  const setDesc = () => {
    const DescriptionMeta = document.querySelector("meta[name~='description']");

    if (page !== "info" && page !== "document") {
      DescriptionMeta.setAttribute("content", t(`descriptions.${page}`));
    } else if (page === "document") {
      DescriptionMeta.setAttribute(
        "content",
        t(`descriptions.${page}`, {
          action: "/" + (params.action || params.method || ""),
        })
      );
    } else {
      DescriptionMeta.setAttribute(
        "content",
        t(`descriptions.${page}`, { name: params.atom })
      );
    }
  };

  useMemo(() => {
    window.scrollTo(0, 0);

    if (lastLocation !== location) {
      if (isRouteErrorResponse(error)) {
        setPage("error");
      } else if (location.pathname === paths["home"]) {
        setPage("home");
      } else if (location.pathname === paths["search"]) {
        setPage("search");
      } else if (location.pathname === paths["table"]) {
        setPage("table");
      } else if (location.pathname.includes(paths["TableResult"])) {
        setPage("TableResult");
      } else if (location.pathname.includes(paths["info"])) {
        setPage("info");
      } else if (location.pathname.includes(paths["document"])) {
        setPage("document");
        loader.hide();
      }

      document.addEventListener("keyup", (ev) => {
        if (ev.code === "Escape") {
          navigate(-1);
        }

        if (ev.shiftKey && ev.target.tagName.toLowerCase() !== "input") {
          let path = undefined;

          switch (ev.code.toLowerCase().replace("key", "")) {
            case "h":
              path = "/";
              break;

            case "t":
              path = "/table";
              break;

            case "s":
              path = "/table/find";
              break;

            case "d":
              path = "/document";
              break;

            default:
              break;
          }

          if (path !== undefined && window.location.pathname !== path) {
            ev.preventDefault();
            ev.stopPropagation();
            navigate(path);
          }
        }
      });

      setNewLocation(location);
    } else {
      loader.hide();
    }
  }, [location]);

  function setPage(newPage) {
    page = newPage;
    setTitle();
    setDesc();
  }

  const title = "Are You Developer?";
  const text = "Get in touch with me";
  const style = [
    `      
      font-size:3rem;
      font-weight:bold;
      `,

    `font-family:helvetica;
      color: white !important;
      font-weight:bold;
      background: rgb(255,89,94);
      background: linear-gradient(90deg, rgba(255,89,94,1) 0%, rgba(255,202,58,1) 25%, rgba(138,201,38,1) 50%, rgba(25,130,196,1) 75%, rgba(106,76,147,1) 100%);
      `,
  ];

  useEffect(() => {
    //theme maybe change in updates
    const ThemeMeta = document.querySelector("meta[name~='theme-color']");
    const bgc = getComputedStyle(document.body)
      .getPropertyValue("--color-bg-rgb")
      .split(",");

    ThemeMeta.setAttribute("content", chroma(bgc).hex());

    document.documentElement.lang = i18n.language;

    if (!mount.current) {
      console.log("%cHi", style[0] + style[1] + "font-style:italic");
      console.log("%c" + title, style[0] + style[1]);
      console.log(
        "%c" + text,
        style[1] + "font-size:1rem;",
        "mailto://shayanfpg9@duck.com"
      );

      mount.current = true;
    }
  });
}
