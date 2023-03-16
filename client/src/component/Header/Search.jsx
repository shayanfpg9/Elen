import { useEffect, useRef } from "react";
import { BsXLg } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Search(props) {
  const searchbox = useRef(),
    input = useRef(),
    navigate = useNavigate();

  const close = () => {
    input.current.value = "";
    props.close();
  };

  const PassSearchRes = () => {
    const replaced = input.current.value
      .replace(/[A-Z]|[a-z]|[0-9]|[-_\n\t\s()|/!@#$%^&*+=`~'"]/gi, "")
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
          navigate(`/table?find=${encodeURI(input.current.value)}`);
          close();
        }
      });
    } else {
      navigate(`/table?find=${encodeURI(input.current.value)}`);
      close();
    }
  };

  useEffect(() => {
    document.documentElement.style.overflowY = "hidden";

    searchbox.current.addEventListener("keyup", ({ code }) => {
      if (code === "Escape") close();
    });

    input.current.focus();

    searchbox.current.addEventListener("submit", (e) => {
      e.preventDefault();
      PassSearchRes();
    });
  });

  return (
    <>
      <div onClick={close} className="blur">
        <button onClick={close} type="button" className="searchbox__close">
          <BsXLg />
        </button>
      </div>

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
          name="team"
          placeholder="مشخصات اتم مورد نظر را جست‌وجو کنید"
        />

        <button className="searchbox__submit" type="submit">
          پیدا کن
        </button>
      </form>
    </>
  );
}
