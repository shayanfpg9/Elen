import styled, { css } from "styled-components";
import { colors } from "./Categories";

//style of AtomCles
const AtomCel = styled.div`
  min-width: calc(var(--first-fibo) / 2);
  min-height: calc(var(--first-fibo) / 2);
  display: block;
  background-color: ${(props) => colors[props.category[0]]};
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
`;

export default function Atom(props) {
  let PropCat = props.category;
  const category = [];
  [...Object.keys(colors), "metal"].forEach((cat) => {
    if (PropCat.includes(cat)) {
      PropCat = PropCat.replace(cat, "");
      category.push(cat);
    }
  });

  return (
    <AtomCel
      number={props.number}
      position={props.position}
      category={[...category]}
      phase={props.phase}
    >
      {props.symbol}
      <sup>{props.number}</sup>
    </AtomCel>
  );
}
