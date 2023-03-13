import styled, { css } from "styled-components";
import { GiSolidLeaf, GiWaterDrop, GiGasPump } from "react-icons/gi";
import { flex, media } from "../CssComponents/Util";

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
      "max-width": "830px",
    },
    css`
      grid-column-start: 4;
      grid-column-end: 14;
      grid-row-start: 2;
      grid-row-end: 5;
    `
  )}

  ${media(
    {
      "min-width": "xs",
      "max-width": "620px",
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
`;

const Item = styled.span`
  color: var(--color-main);
  font-size: 1rem;
  cursor: pointer;

  > svg {
    width: 1rem;
    height: 1rem;
    margin-left: 0.5rem;
  }
`;

export default function Phase() {
  return (
    <Box>
      <Item data-phase="solid" className="phase__item">
        <GiSolidLeaf />
        جامد
      </Item>
      <Item data-phase="liquid" className="phase__item">
        <GiWaterDrop />
        مایع
      </Item>
      <Item data-phase="gas" className="phase__item">
        <GiGasPump />
        گاز
      </Item>
    </Box>
  );
}
