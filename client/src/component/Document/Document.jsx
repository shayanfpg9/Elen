//deps
import { useContext, useEffect, useRef, useState } from "react";
import { Link, Outlet, useLoaderData, useParams } from "react-router-dom";

// context
import { LoadedContext } from "../Context/Loaded";
import { DocumentContext } from "../Context/Document";

//hooks
import useConfig from "../Hook/useConfig";
import { useTranslation } from "react-i18next";

//utils
import styled, { css } from "styled-components";
import flex from "../CssComponents/Flexbox";
import { colors } from "../CssComponents/MethodColor";
import media from "../CssComponents/Media";

const similar = css`
  font-size: 1.5rem;
  --method-font-size: 1.3rem;
`;

const Aside = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  padding-top: calc(0.5 * var(--first-fibo));
  width: min(calc(var(--first-fibo) * 3), 30vw);
  height: 100vh;
  box-shadow: 0px 0.5rem 1rem 5px var(--color-bg);
  border-bottom-right-radius: calc(var(--first-fibo) / 2);
  border-top-right-radius: calc(var(--first-fibo) / 2);
  transform: translateY(${(props) => props.top}px);

  ${media(
    {
      "max-width": "md",
    },
    css`
      position: absolute;
      top: 2vh;
      left: 50%;
      width: 90vw;
      height: 32vh;
      border-radius: calc(var(--first-fibo) / 2);
      transform: translate(-50%, 0);
      overflow-y: scroll;
      padding: 0.5rem 0;

      @supports (scrollbar-width: thin) {
        //firefox familly
        scrollbar-width: thin;
        scrollbar-color: #fffa transparent;
      }

      &::-webkit-scrollbar {
        width: 0.5rem;
        background-color: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #fffa;
        border-radius: 10px;
      }

      > ul {
        transform: translateY(0%);
      }
    `
  )};

  ${flex};
  ${similar};
`;

const List = styled.ul`
  min-height: 50%;
  transform: translateY(-25%);
  width: 100%;
  ${flex};
`;

const Item = styled.li`
  width: 100%;
  text-align: center;
  position: relative;
  margin-top: 0.2rem;

  ${media(
    {
      "min-width": "sm",
      "max-width": "md",
    },
    css`
      width: 50%;
      float: left;
    `
  )};

  &:hover::after {
    opacity: 1;
    transform: translateX(-50%) scaleX(1);
  }

  pointer-events: ${(props) => props.active && "none"};

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    transform: translateX(-50%) scaleX(${(props) => (props.active ? 1 : 0)});
    display: block;
    left: 50%;

    width: 50%;
    height: 3px;
    border-radius: 1rem;
    background-color: var(--color-text);
    opacity: ${(props) => (props.active ? 1 : 0)};

    transition: all 0.5s ease;
    transform: ${(props) => props.active && "translateX(-50%) scaleX(1)"};
  }

  a {
    text-decoration: none;
    min-height: 2.5rem;
    height: auto;
    display: block;
    overflow: visible;
    padding-bottom: 0.5rem;

    ${(props) =>
      props.method !== "init" &&
      css`
        &::before {
          --method-color: ${(props) => colors[props.method]};

          display: inline-block;
          content: "${(props) => props.method.toUpperCase()}";
          border: 1px solid var(--method-color);
          height: 1.5rem;
          padding: 0 0.2rem;
          border-radius: 0.5rem;
          color: var(--method-color);
          margin: 0 0.5rem;
          margin-block-end: -0.5rem;
          font-size: var(--method-font-size);
        }
      `};
  }
`;

const Pages = styled.section`
  float: right;
  width: calc(max(calc(100vw - var(--first-fibo) * 3), 70vw) - 3.5rem);
  padding-left: 1.5rem;
  ${similar};
  ${flex};

  ${media(
    {
      "max-width": "md",
    },
    css`
      width: 100%;
      margin-top: 32vh;
    `
  )};
`;

export function ApiGatewaysLoader() {
  return [
    {
      method: "init",
      path: "/",
    },
    {
      method: "init",
      path: "init/",
    },
    {
      method: "get",
      path: "get/all",
    },
    {
      method: "get",
      path: "get/single",
    },
    {
      method: "get",
      path: "get/single-translate",
    },
    {
      method: "post",
      path: "post/search",
    },
  ];
}

export default function Document() {
  const loaded = useContext(LoadedContext),
    Mount = useRef(false),
    Gateways = useLoaderData(),
    { t } = useTranslation("pages"),
    [top, setTop] = useState(0);

  const { method, action } = useParams();
  const path = `${method || ""}/${action || ""}`;

  useConfig();

  useEffect(() => {
    if (!Mount.current) {
      loaded.hide();
      window?.addEventListener("scroll", () => {
        setTop(window?.scrollY);
      });
      Mount.current = true;
    }
  });

  return (
    <>
      <Aside top={top}>
        <List>
          {Gateways.map((gateway) => (
            <Item
              active={path === gateway.path}
              key={t(`${gateway.path}.name`)}
              method={gateway.method}
            >
              <Link relative="path" to={"/document/" + gateway.path}>
                {t(`${gateway.path}.name`)}
              </Link>
            </Item>
          ))}
        </List>
      </Aside>

      <Pages>
        <DocumentContext.Provider value={Gateways}>
          <Outlet />
        </DocumentContext.Provider>
      </Pages>
    </>
  );
}
