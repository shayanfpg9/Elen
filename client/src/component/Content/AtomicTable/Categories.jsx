import styled, { css } from "styled-components";

export const colors = {
  "alkali metal": "#FF080C",
  "alkaline earth metal": "#FF952E",
  metalloid: "#57C3F8",
  lanthanide: "#FC9FFF",
  transition: "#FFF428",
  "post-transition": "#00833F",
  actinide: "#FC2865",
  unknown: "#262626",
  nonmetal: "#3161FF",
  "noble gas": "#3A2151",
};

const flex = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column wrap;
`;

const Name = styled.span`
  writing-mode: horizontal-tb;
  position: absolute;
  top: 0%;
`;

const Category = styled.section`
  grid-column-start: 5;
  grid-column-end: 13;
  grid-row-start: 2;
  grid-row-end: 5;
  margin: 0.5rem 0;
  border-radius: 1rem;
  border: var(--color-bg) 3px solid;
  ${flex}
  writing-mode: tb-rl;
  position: relative;
`;

const Case = styled.div`
  ${flex}
  height: 75%;
  padding-top: 0.5rem;
`;

const Item = styled.span`
  background-color: ${(props) => colors[props.name]};
  height: 100%;
  border-radius: 5px;
  margin: 0 0.1rem;
  color: ${props=>props.light ? "var(--color-text)":"var(--color-fg)"};
`;

export default function Categories() {
  return (
    <Category>
      <Case className="metal">
        <Name>فلزات</Name>
        <Item name="alkali metal" className="cat-item s-2">
          فلزات قلیایی
        </Item>
        <Item name="alkaline earth metal" className="cat-item s-2">
          فلزات قلیایی خاکی
        </Item>
        <Item name="transition" className="cat-item s-2" light>
          فلزات واسطه
        </Item>
        <Item name="post-transition" className="cat-item s-2">
          فلزات پس واسطه
        </Item>
        <Item name="lanthanide" className="cat-item s-1" light>
          لانتانید ها
        </Item>
        <Item name="actinide" className="cat-item s-1">
          اکتینید ها
        </Item>
      </Case>
      <Item
        as={Case}
        name="metalloid"
        className="cat-item s-2 name"
        style={{ height: "80%" }}
      >
        شبه فلزات
      </Item>
      <Case className="nometal">
        <Name>نا فلزات</Name>
        <Item name="noble gas" className="cat-item s-2">
          گاز های نجیب
        </Item>
        <Item name="nonmetal" className="cat-item s-2">
          غیر فلزات
        </Item>
      </Case>
    </Category>
  );
}