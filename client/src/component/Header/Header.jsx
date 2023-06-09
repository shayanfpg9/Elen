//deps
import { useState } from "react";
import { Link } from "react-router-dom";

//componets
import Menu from "./Menu.jsx";
import Search from "./Search.jsx";

//assets
import logo from "../../asset/logo.svg";

//libs & utils
import { getSize } from "../funcs/funcs";
import { BsList } from "react-icons/bs";
import { useTranslation } from "react-i18next";

export default function Header() {
  const [width, setWidth] = useState(window?.innerWidth);
  window?.addEventListener("resize", () => {
    setWidth(window?.innerWidth);
  });

  const { t } = useTranslation();

  const [status, setStatus] = useState(false);

  const MenuBtnClick = () => {
    if (status) setStatus(false);
    else setStatus(true);
  };

  const [searchBox, setSearchBox] = useState(false);
  const SearchBoxClick = () => {
    if (searchBox) setSearchBox(false);
    else setSearchBox(true);

    MenuBtnClick(); //close menu by search box status -> handle bugs
  };

  return (
    <>
      <span className="header--top"></span>
      <header className="header">
        <img src={logo} alt={t("name")} className="header__logo fibo-1--ci" />
        <h1 title={t("name")} className="header__title">
          <Link to="/"> {t("name")} </Link>
        </h1>

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
