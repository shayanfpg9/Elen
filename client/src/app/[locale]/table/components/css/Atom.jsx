"use client";

import flex from "@/app/components/css/Flexbox";
import media from "@/app/components/css/Media";
import Link from "next/link";
import { useEffect, useState } from "react";
import { styled, css } from "styled-components";

const StyledTemp = styled(Link).attrs((props) => ({
  "data-category": props.category?.join(" , "),
  "data-phase": props.phase?.toLowerCase(),
}))`
  min-width: calc(var(--first-fibo) / 2);
  min-height: calc(var(--first-fibo) / 2);
  display: block;
  background-color: ${(props) => props.color};
  border-radius: 0.3rem;
  margin: 0.1rem;
  text-decoration: none;
  transition: all 0.5s var(--animation);

  ${(props) =>
    (props.$number >= 57 && props.$number <= 71) ||
    (props.$number >= 89 && props.$number <= 103)
      ? //30 elements in new position
        css`
          grid-row: ${(props) => props.$position[1]};
          grid-column: ${(props) => props.$position[0] + 2};
        `
      : css`
          grid-row: ${(props) => props.$position[1] + 1};
          grid-column: ${(props) => props.$position[0] + 1};
        `};

  ${flex};

  &,
  & * {
    color: ${(props) =>
      props.$category.includes("transition") &&
      !props.$category.includes("unknown")
        ? props.theme.name === "light"
          ? "var(--color-text)"
          : "var(--color-fg)"
        : props.theme.name === "light"
        ? "var(--color-fg)"
        : "var(--color-text)"};

    sub {
      font-size: 0.8rem;
      margin-right: 0.1rem;
    }

    &.hide {
      filter: blur(5px);
      background-color: ${(props) => props.$darkenColor[0]};
      pointer-events: none;
      opacity: 0.6;
    }
  }

  &.active,
  &:hover {
    border: 3px solid ${(props) => props.$darkenColor[1]};
  }

  &:hover {
    transform: scale(1.1); //for hover corners this animation is better
    box-shadow: 0px 0px 10px var(--color-bg);

    @supports (backdrop-filter: blur(2px);
    ) {
      //firefox familly bug
      backdrop-filter: blur(2px);
    }
  }

  ${media(
    {
      "min-width": "xs",
      "max-width": "719px",
    },
    css`
      grid-row: ${(props) => props.$number};
      border: 3px solid ${(props) => props.$darkenColor[2]};
      grid-column: 1;

      &:hover {
        transform: scale(1.05);
      }
    `
  )}
`;

export function AtomCel(props) {
  const [Mount, setState] = useState(false);

  useEffect(() => {
    setState(true);
  }, []);

  if (Mount) {
    return <StyledTemp {...props} />;
  } else {
    return <></>;
  }
}
