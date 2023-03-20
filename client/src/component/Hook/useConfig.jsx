//deps
import { useEffect } from "react";

//libs & utils
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";
import chroma from "chroma-js";

export default function useConfig(error = false) {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation("config");
  const name = useTranslation().t("name");
  const params = useParams();
  const locations = {
    home: "/",
    info: "/atom/",
    search: "/table/find",
    table: "/table",
    TableResult: "/table/find/",
  };

  let location = "";

  const setTitle = () => {
    document.title = name + " - " + t(location);

    switch (
      location //with special params
    ) {
      case "info":
        document.title += ` (${params.atom})`;
        break;

      case "TableResult" && params.query:
        document.title += ` (${params.query})`;
        break;

      default:
        break;
    }
  };

  const setDesc = () => {
    const DescriptionMeta = document.querySelector("meta[name~='description']");

    if (location !== "info") {
      DescriptionMeta.setAttribute("content", t(`descriptions.${location}`));
    } else {
      DescriptionMeta.setAttribute(
        "content",
        t(`descriptions.${location}`).replace("%NAME%", params.atom)
      );
    }
  };

  if (error) {
    setLocation("error");
  } else if (pathname === locations["home"]) {
    setLocation("home");
  } else if (pathname === locations["search"]) {
    setLocation("search");
  } else if (pathname === locations["table"]) {
    setLocation("table");
  } else if (pathname.includes(locations["TableResult"])) {
    setLocation("TableResult");
  } else if (pathname.includes(locations["info"])) {
    setLocation("info");
  }

  function setLocation(NewLoc) {
    location = NewLoc;
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
