import { useContext, useEffect, useRef } from "react";
import * as bs from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { RefreshContext } from "../Context/Refresh";

export default function Menu(props) {
  const search = () => {};
  const MenuRef = useRef();
  const left = props.status ? 0 : "calc(-1 * var(--menu-width))";
  // eslint-disable-next-line
  const [refresh, setRefresh] = useContext(RefreshContext);
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
      icon: bs.BsBinocularsFill,
      link: {
        element: "button",
        props: { onClick: search, type: "button" },
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

  const { pathname } = useLocation();

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
            onClick={props.function}
            title={item.text}
            key={item.text}
          >
            <item.link.element {...item.link.props}>
              <item.icon />
              {item.text}
            </item.link.element>
          </li>
        );
      })}

      <li
        className="header__menu-item fibo-1--sq icons"
        onClick={props.function}
      >
        <a
          href="https://github.com/shayanfpg9/elen"
          target="_blank"
          title="گیت‌هاب پروژه"
          rel="noreferrer"
        >
          <bs.BsGithub />
        </a>

        {pathname.includes("table") ? (
          <button
            type="button"
            title="رفرش اطلاعات"
            onClick={() => {
              setRefresh(true);
            }}
          >
            <bs.BsCapslockFill />
          </button>
        ) : (
          ""
        )}
      </li>
    </menu>
  );
}
