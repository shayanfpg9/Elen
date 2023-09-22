"use client";

//deps
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import useNavigate from "@/app/hooks/useNavigate";

//utils
import { BsXLg } from "react-icons/bs";
import Swal from "sweetalert2";

export default function Search(props) {
  const searchbox = useRef(),
    input = useRef(),
    navigate = useNavigate();

  const t = useTranslations("main.search");

  const close = () => {
    input.current.value = "";
    props.close();
  };

  useEffect(() => {
    const PassSearchRes = (value) => {
      const replaced = value
        .replace(/[A-Z]|[a-z]|[0-9]|[-_\n\t\s()|/!@#$%^&*+=`~'".?<>,]/gi, "")
        .trim();

      if (value !== "") {
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
              show();
            }
          });
        } else {
          if (!props.single) close();
          navigate(`/table/find/${encodeURI(value)}`);
          show();
        }
      }
    };

    searchbox.current.addEventListener("keyup", ({ code }) => {
      if (code === "Escape") close();
    });

    input.current.focus();

    searchbox.current.addEventListener("submit", (e) => {
      e.preventDefault();
      if (input.current !== null) PassSearchRes(input.current.value);
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
          {t("btn")}
        </button>
      </form>
    </>
  );
}
