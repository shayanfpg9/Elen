import * as bs from "react-icons/bs";

export default function Menu(props) {
  const left = props.status ? 0 : "calc(-1 * var(--menu-width))";

  return (
    <menu style={{ left }} className={`header__menu`}>
      <i className="header__menu-icon fibo-1--sq close" onClick={props.function}>
        <bs.BsXLg />
      </i>

      <li className="header__menu-item fibo-1--sq">
        <a href="/">
          <bs.BsHouseFill />
          خانه
        </a>
      </li>
      <li className="header__menu-item fibo-1--sq">
        <a href="https://github.com/shayanfpg9" target="_blank">
          <bs.BsGithub />
          درباره ی من
        </a>
      </li>
      <li className="header__menu-item fibo-2--sq">
        <a href="/search">
          <bs.BsBinocularsFill />
          جست و جو
        </a>
      </li>
    </menu>
  );
}
