//deps
import { useEffect, useMemo, useRef } from "react";

//libs & utils
import { useTranslation } from "react-i18next";
import {
  isRouteErrorResponse,
  useLocation,
  useParams,
  useRouteError,
} from "react-router-dom";
import chroma from "chroma-js";

export default function useConfig(loader) {
  const pageMount = useRef(false);
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
  }, [location]);

  function setPage(newPage) {
    page = newPage;
    setTitle();
    setDesc();
  }

  useEffect(() => {
    //theme maybe change in updates
    const ThemeMeta = document.querySelector("meta[name~='theme-color']");
    const bgc = getComputedStyle(document.body)
      .getPropertyValue("--color-bg-rgb")
      .split(",");

    ThemeMeta.setAttribute("content", chroma(bgc).hex());

    document.documentElement.lang = i18n.language;
  });
}
