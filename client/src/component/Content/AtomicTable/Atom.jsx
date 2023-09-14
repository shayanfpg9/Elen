import { mix } from "chroma-js";
import { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
// import { LoaderContext } from "../../Context/Loaded";
import { colors, flex, media } from "../../CssComponents/Util";

//style of AtomCles
const AtomCel = styled(Link).attrs((props) => ({
  "data-category": props.category.join(" , "),
  "data-phase": props.phase.toLowerCase(),
}))`
  min-width: calc(var(--first-fibo) / 2);
  min-height: calc(var(--first-fibo) / 2);
  display: block;
  background-color: ${(props) => props.color};
  border-radius: 0.3rem;
  margin: 0.1rem;
  text-decoration: none;
  ${(props) =>
    (props.number >= 57 && props.number <= 71) ||
    (props.number >= 89 && props.number <= 103)
      ? //30 elements in new position
        css`
          grid-row: ${(props) => props.position[1]};
          grid-column: ${(props) => props.position[0] + 2};
        `
      : css`
          grid-row: ${(props) => props.position[1] + 1};
          grid-column: ${(props) => props.position[0] + 1};
        `};
  transition: all 0.5s var(--animation);

  ${flex};

  &,
  & * {
    color: ${(props) =>
      props.category.includes("transition") &&
      !props.category.includes("unknown")
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
      background-color: ${(props) => props.color.darken(0.2)};
      pointer-events: none;
      opacity: 0.6;
    }
  }

  &.active,
  &:hover {
    border: 3px solid ${(props) => props.color.darken(0.7)};
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
      grid-row: ${(props) => props.number};
      border: 3px solid ${(props) => props.color.darken(0.5)};
      grid-column: 1;
    `
  )}
`;

export default function Atom(props) {
  let PropCat = props.category.replace("post-transition", "post_transition");

  const category = [];
  [...Object.keys(colors), "metal"].forEach((cat) => {
    if (PropCat.includes(cat)) {
      PropCat = PropCat.replace(cat, "");
      category.push(cat);
    }
  });

  const color = mix(
    category[0] === "unknown"
      ? colors[category[1].replace("-", "")]
      : colors[category[0].replace("-", "")],
    colors.unknown,
    category.includes("unknown") ? 0.75 : 0
  );

  const ThisEl = useRef();

  return (
    <AtomCel
      to={`/atom/${props.name}`}
      data-name={props.name}
      number={props.number}
      position={props.position}
      phase={props.phase}
      category={category}
      color={color}
      title={props.name}
      aria-label={props.name}
      className={`Atom ${props.className}`}
      ref={ThisEl}
    >
      <span>
        <sub>{props.number}</sub>
        {props.symbol}
      </span>
    </AtomCel>
  );
}
