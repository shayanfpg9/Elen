import { mix } from "chroma-js";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { colors, flex, media } from "../CssComponents/Util";

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

  ${flex}

  &,
  & * {
    color: ${(props) =>
      props.category.includes("transition") &&
      !props.category.includes("unknown")
        ? "var(--color-text)"
        : "var(--color-fg)"};
  }

  sub {
    font-size: 0.6rem;
    margin-right: 0.1rem;
  }

  &.hide {
    filter: blur(5px);
    background-color: ${(props) => props.color.darken(0.2)};
  }

  &:hover {
    transform: translateY(-0.5rem);
    backdrop-filter: blur(2px);
    box-shadow: 0px 0px 10px #fff;
  }

  &.active,
  &:hover {
    border: 3px solid ${(props) => props.color.darken(0.7)};
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
  let PropCat = props.category.replace("post-transition", "posttran");
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

  return (
    <AtomCel
      to={`/table/${props.name}`}
      data-name={props.name}
      number={props.number}
      position={props.position}
      phase={props.phase}
      category={category}
      color={color}
      title={props.name}
      aria-label={props.name}
      className="Atom"
    >
      <span>
        <sub>{props.number}</sub>
        {props.symbol}
      </span>
    </AtomCel>
  );
}
