import styled from "styled-components";
import { GiSolidLeaf, GiWaterDrop, GiGasPump } from "react-icons/gi";

const Box = styled.section`
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
`;

const Item = styled.span`
  color: var(--color-main);
  font-size: 1rem;

  > svg {
    width: 1rem;
    height: 1rem;
  }
`;

export default function Phase() {
  return (
    <Box className="box">
      <Item phase="solid" className="item">
        <GiSolidLeaf />
        جامد
      </Item>
      <Item phase="liquid" className="item">
        <GiWaterDrop />
        مایع
      </Item>
      <Item phase="gas" className="item">
        <GiGasPump />
        گاز
      </Item>
    </Box>
  );
}
