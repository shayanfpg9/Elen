import styled, { css } from "styled-components";
import { colors } from "./Categories";

//style of AtomCles
const AtomCel = styled.div.attrs((props) => ({
  "data-category": props.category.join(" , "),
  "data-phase": props.phase.toLowerCase(),
}))`
  min-width: calc(var(--first-fibo) / 2);
  min-height: calc(var(--first-fibo) / 2);
  display: block;
  background-color: ${(props) =>
    props.category[0] === "unknown"
      ? colors[props.category[1].replace("-", "")]
      : colors[props.category[0]].replace("-", "")};
  border-radius: 0.3rem;
  margin: 0.1rem;
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

  &,
  & * {
    color: ${(props) =>
      props.category.includes("transition")
        ? "var(--color-text)"
        : "var(--color-fg)"};
  }

  sup {
    font-size: 0.6rem;
    margin-left: 0.1rem;
  }

  &.hide {
    opacity: 0;
  }
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

  return (
    <AtomCel
      data-name={props.name}
      number={props.number}
      position={props.position}
      phase={props.phase}
      category={category}
      className="Atom"
    >
      {props.symbol}
      <sup>{props.number}</sup>
    </AtomCel>
  );
}
