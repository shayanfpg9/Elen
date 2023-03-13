import styled from "styled-components";
import { GiSolidLeaf, GiWaterDrop, GiGasPump } from "react-icons/gi";

const Box = styled.section`
  max-height: calc(var(--first-fibo) / 2);
  grid-column-start: 14;
  grid-column-end: 19;
  margin: 0.5rem 0;
  border-radius: 1rem;
  border: var(--color-bg) 3px solid;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-flow: row nowrap;
  padding: 0 1rem;
  margin-right: 0.2rem;
`;

const Item = styled.span`
  color: var(--color-main);
  font-size: 1rem;

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
