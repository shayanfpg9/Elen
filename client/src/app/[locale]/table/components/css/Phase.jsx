"use client";

import flex from "@/app/components/css/Flexbox";
import media from "@/app/components/css/Media";
import { css, styled } from "styled-components";

const Box = styled.section`
  max-height: calc(var(--first-fibo) / 2);
  grid-column-start: 14;
  grid-column-end: 19;
  margin: 0.5rem 0;
  border-radius: 1rem;
  border: var(--color-bg) 3px solid;
  ${flex({
    Jusc: "space-between",
    FFlow: "row nowrap",
  })}
  padding: 0 1rem;
  margin-right: 0.2rem;
  cursor: default;
  
  ${media(
    {
      "min-width": "xs",
      "max-width": "840px",
    },
    css`
      position: absolute;
      bottom: calc(var(--first-fibo) + 1rem);
      width: 90%;
      min-height: 3rem;
      left: 50%;
      transform: translateX(-50%);
    `
  )}

  ${media(
    { "min-width": "841px", "max-width": "989px" },
    css`
      grid-row: 2;
    `
  )}
`;

const Item = styled.span.attrs((props) => ({
  title: props.children[1],
  "aria-label": props.children[1],
}))`
  font-size: 1rem;
  cursor: pointer;

  &,
  & * {
    color: var(--color-text);
  }

  > svg {
    width: 1rem;
    height: 1rem;
  }

  html.rtl & > svg {
    margin-left: 0.5rem;
  }

  html.ltr & > svg {
    margin-right: 0.5rem;
  }
`;

export { Box, Item };
