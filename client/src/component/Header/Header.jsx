import { useState } from "react";
import { useSize } from "../Hook/hooks.jsx";
import Menu from "./Menu.jsx";
import { BsList } from "react-icons/bs";

export default function Header() {
  const [width, setWidth] = useState(window?.innerWidth);
  window?.addEventListener("resize", () => {
    setWidth(window?.innerWidth);
  });

  const [status, setStatus] = useState(false);

  const MenuBtnClick = () => {
    if (status) setStatus(false);
    else setStatus(true);
  };

  return (
    <>
      <span className="header--top"></span>
      <header className="header">
        <img src="" alt="شیمی کده مجازی الن" className="header__logo fibo-1--ci" />
        <h1 className="header__title">شیمی کده مجازی الن</h1>

        {width >= useSize("xl") ? (
          <Menu></Menu>
        ) : (
          <i onClick={MenuBtnClick} className="header__menu-icon">
            <BsList />
          </i>
        )}
      </header>

      {width < useSize("xl") && (
        <Menu status={status} function={MenuBtnClick} />
      )}
    </>
  );
}
