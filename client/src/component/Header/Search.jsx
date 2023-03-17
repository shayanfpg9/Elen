import { useContext, useEffect, useRef } from "react";
import { BsXLg } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { isNull } from "lodash";
import Swal from "sweetalert2";
import { LoadedContext } from "../Context/Loaded";

export default function Search(props) {
  const searchbox = useRef(),
    input = useRef(),
    navigate = useNavigate(),
    { hide } = useContext(LoadedContext);

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
          title: "لطفا از کارکتر های انگلیسی استفاده کنید",
          text: "احتمال دارد نتیجه ی دلخواه را بدست نیاورید",
          icon: "warning",
          cancelButtonText: "ادامه",
          confirmButtonText: "اصلاح",
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
        title="جست‌وجو کنید"
      >
        <input
          ref={input}
          role="search"
          className="searchbox__input"
          type="text"
          placeholder="مشخصات اتم مورد نظر را جست‌وجو کنید"
        />

        <button className="searchbox__submit" type="submit">
          پیدا کن
        </button>
      </form>

      {props.single && <Link to="/">بازگشت به خانه</Link>}
    </>
  );
}
