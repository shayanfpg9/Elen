import { useState } from "react";
import { getSize } from "../funcs/funcs";
import Menu from "./Menu.jsx";
import Search from "./Search.jsx";
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

  const [searchBox, setSearchBox] = useState(false);
  const SearchBoxClick = () => {
    if (searchBox) setSearchBox(false);
    else setSearchBox(true);

    MenuBtnClick();
  };

  return (
    <>
      <span className="header--top"></span>
      <header className="header">
        <img
          src=""
          alt="شیمی کده مجازی الن"
          className="header__logo fibo-1--ci"
        />
        <h1 className="header__title">شیمی کده مجازی الن</h1>

        {width >= getSize("xl") ? (
          <Menu SearchBoxClick={SearchBoxClick}></Menu>
        ) : (
          <i onClick={MenuBtnClick} className="header__menu-icon">
            <BsList />
          </i>
        )}
      </header>
      {searchBox && (
        <Search
          close={() => {
            setSearchBox(false);
          }}
        />
      )}

      {width < getSize("xl") && (
        <Menu
          status={status && !searchBox}
          function={MenuBtnClick}
          SearchBoxClick={SearchBoxClick}
        />
      )}
    </>
  );
}
