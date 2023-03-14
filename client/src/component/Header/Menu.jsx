import { useEffect, useRef } from "react";
import * as bs from "react-icons/bs";
import { Link } from "react-router-dom";

export default function Menu(props) {
  const search = () => {};
  const MenuRef = useRef();
  const left = props.status ? 0 : "calc(-1 * var(--menu-width))";
  const items = [
    {
      icon: bs.BsHouseFill,
      link: {
        element: Link,
        props: { to: "/" },
      },
      text: "خانه",
    },
    {
      icon: bs.BsTable,
      link: {
        element: Link,
        props: { to: "/table" },
      },
      text: "جدول",
    },
    {
      icon: bs.BsGithub,
      link: {
        element: "a",
        props: {
          href: "https://github.com/shayanfpg9/elen",
          target: "_blank",
          rel: "noreferrer",
        },
      },
      text: "گیت‌‌هاب",
    },
    {
      icon: bs.BsBinocularsFill,
      link: {
        element: "button",
        props: { onClick: search },
      },
      text: "جست‌و‌جو",
    },
  ];

  useEffect(() => {
    window.onkeyup = ({ code }) => {
      if (code === "Escape" && props.status) {
        window.onkeyup = undefined;
        props.function();
      }
    };
  });

  return (
    <menu ref={MenuRef} style={{ left }} className={`header__menu`}>
      <i
        className="header__menu-icon fibo-1--sq close"
        onClick={props.function}
      >
        <bs.BsXLg />
      </i>

      {items.map((item) => {
        return (
          <li
            className="header__menu-item fibo-1--sq"
            role="menuitem"
            key={item.text}
          >
            <item.link.element {...item.link.props}>
              <item.icon />
              {item.text}
            </item.link.element>
          </li>
        );
      })}
    </menu>
  );
}
