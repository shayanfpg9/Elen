//deps
import { useContext, useEffect, useRef, useState } from "react";
import { Link, Outlet, useLoaderData } from "react-router-dom";

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
      padding-top: calc(1.5 * var(--first-fibo));
      width: 90vw;
      position: relative;
      height: 30vh;
      border-radius: calc(var(--first-fibo) / 2);
      margin-bottom: 2rem;
      transform: translateY(0);
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

  a {
    text-decoration: none;
    min-height: 4rem;
    height: auto;
    display: block;
    overflow: visible;

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
      `}
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
            <Item key={t(`${gateway.path}.name`)} method={gateway.method}>
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
