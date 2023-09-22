"use client";

import flex from "@/app/components/css/Flexbox";
import media from "@/app/components/css/Media";
import { styled, css } from "styled-components";
import { colors } from "./Colors";

const Name = styled.span`
  writing-mode: horizontal-tb;
  position: absolute;
  top: 0%;
`;

const Category = styled.section`
  max-height: calc(var(--first-fibo) * 2);
  grid-column-start: 4;
  grid-column-end: 14;
  grid-row-start: 2;
  grid-row-end: 5;
  margin: 0.5rem 0;
  border-radius: 1rem;
  border: var(--color-bg) 3px solid;
  ${flex({
    FFlow: "column wrap",
  })}
  writing-mode: tb-rl;
  position: relative;
  margin: 0.2rem 0.5rem;
  cursor: default;

  ${media(
    {
      "min-width": "xs",
      "max-width": "840px",
    },
    css`
      position: absolute;
      bottom: calc(var(--first-fibo) * 2 + 1rem);
      width: 90%;
      left: 50%;
      transform: translateX(-50%);
      margin: 0.2rem 0;
    `
  )}

  ${media(
    {
      "min-width": "xs",
      "max-width": "510px",
    },
    css`
      max-height: 50vh;
      bottom: calc(var(--first-fibo) * 2.5 + 1rem);
      width: 90%;
      height: calc(var(--first-fibo) * 4);

      ${Name} {
        display: none;
      }
    `
  )}

  ${media(
    {
      "min-width": "xs",
      "max-width": "370px",
    },
    css`
      display: none;
    `
  )}
`;

const Case = styled.div`
  ${flex({
    FFlow: "column wrap",
  })}
  height: 75%;
  padding-top: 0.5rem;
`;

const Item = styled.span.attrs((props) => ({
  title: props.children,
  "aria-label": props.children,
}))`
  background-color: ${(props) =>
    colors[props["data-category"].replace(/-/g, " ")]};
  height: 100%;
  border-radius: 5px;
  margin: 0 0.1rem;
  color: ${(props) =>
    (
      props.reverse
        ? props.theme.name !== "light"
        : props.theme.name === "light"
    )
      ? "var(--color-fg)"
      : "var(--color-text)"};
  cursor: pointer;
  padding: 0.2rem 0;
`;

export { Name, Category, Case, Item };
