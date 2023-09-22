"use client";

import Image from "next/image";
import Link from "next/link.js";
import { useTranslations } from "next-intl";
import Menu from "./menu";
import getSize from "@/functions/getSize";
import { useEffect, useState } from "react";
import { BsList } from "react-icons/bs";
import Search from "./Search";

export default function Header() {
  if (typeof window === "undefined") {
    return <></>;
  }

  const t = useTranslations("main");
  const name = t("name");

  const [Mount, setMount] = useState(false);
  const [width, setWidth] = useState(window?.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window?.innerWidth);
    });
  }, []);

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

  useEffect(() => {
    setMount(true);
  }, []);

  if (Mount) {
    return (
      <>
        <span className="header--top"></span>
        <header className="header">
          <Image
            src="/logo.svg"
            priority
            alt={name}
            width={0}
            height={0}
            className="header__logo fibo-1--ci"
          />
          <h1 title={name} className="header__title">
            <Link href="/">{name}</Link>
          </h1>

          {width >= getSize("xl") ? (
            <Menu function={() => {}} SearchBoxClick={SearchBoxClick}></Menu>
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
}
