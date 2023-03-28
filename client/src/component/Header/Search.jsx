//deps
import { useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

//utils
import { BsXLg } from "react-icons/bs";
import { isNull } from "lodash";
import Swal from "sweetalert2";
import { useConfig } from "../Hook/hooks";

//contexts
import { LoadedContext } from "../Context/Loaded";
import { useTranslation } from "react-i18next";

export default function Search(props) {
  const searchbox = useRef(),
    input = useRef(),
    navigate = useNavigate(),
    { hide, show } = useContext(LoadedContext);

  const { t } = useTranslation("search");
  const back = useTranslation("error").t("back");

  useConfig();

  const close = () => {
    input.current.value = "";
    props.close();
  };

  const Mount = useRef(false);

  useEffect(() => {
    if (!Mount.current) {
      hide();
      Mount.current = true;
    }

    const PassSearchRes = (value) => {
      const replaced = value
        .replace(/[A-Z]|[a-z]|[0-9]|[-_\n\t\s()|/!@#$%^&*+=`~'".?<>,]/gi, "")
        .trim();

      if (replaced.length) {
        Swal.fire({
          title: t("character.title"),
          text: t("character.msg"),
          icon: "warning",
          cancelButtonText: t("character.false"),
          confirmButtonText: t("character.true"),
          background: "var(--color-fg)",
          color: "var(--color-text)",
          showCancelButton: true,
          showCloseButton: true,
        }).then((res) => {
          if (res.isDismissed && res.dismiss === "cancel") {
            if (!props.single) close();
            navigate(`/table/find/${encodeURI(value)}`);
          }
        });
      } else {
        if (!props.single) close();
        navigate(`/table/find/${encodeURI(value)}`);
      }
    };

    document.documentElement.style.overflowY = "hidden";

    searchbox.current.addEventListener("keyup", ({ code }) => {
      if (code === "Escape") close();
    });

    input.current.focus();

    searchbox.current.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!isNull(input.current)) PassSearchRes(input.current.value);
      show();
    });
  });

  return (
    <>
      {!props.single && (
        <div onClick={close} className="blur">
          <button onClick={close} type="button" className="searchbox__close">
            <BsXLg />
          </button>
        </div>
      )}

      <form
        ref={searchbox}
        method="get"
        className="searchbox"
        title={t("hover")}
      >
        <input
          ref={input}
          role="search"
          className="searchbox__input"
          type="text"
          placeholder={t("placeholder")}
        />

        <button className="searchbox__submit" type="submit">
          {t("btn")}{" "}
        </button>
      </form>

      {props.single && <Link to="/">{back}</Link>}
    </>
  );
}
