import chroma from "chroma-js";
import styled, { css } from "styled-components";

export const colors = {
  "alkali metal": chroma("#FF080C"),
  "alkaline earth metal": chroma("#FF952E"),
  metalloid: chroma("#57C3F8"),
  lanthanide: chroma("#FC9FFF"),
  posttran: chroma("#00833F"),
  transition: chroma("#FFF428"),
  actinide: chroma("#FC2865"),
  unknown: chroma("#232323"),
  nonmetal: chroma("#3161FF"),
  "noble gas": chroma("#3A2151"),
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
  max-height: calc(var(--first-fibo) * 2);
  grid-column-start: 4;
  grid-column-end: 14;
  grid-row-start: 2;
  grid-row-end: 5;
  margin: 0.5rem 0;
  border-radius: 1rem;
  border: var(--color-bg) 3px solid;
  ${flex}
  writing-mode: tb-rl;
  position: relative;
  margin: 0.2rem 0.5rem;
`;

const Case = styled.div`
  ${flex}
  height: 75%;
  padding-top: 0.5rem;
`;

const Item = styled.span`
  background-color: ${(props) =>
    colors[props["data-category"].replace(/-/g, " ")]};
  height: 100%;
  border-radius: 5px;
  margin: 0 0.1rem;
  color: ${(props) => (props.light ? "var(--color-text)" : "var(--color-fg)")};
`;

export default function Categories() {
  return (
    <Category>
      <Case>
        <Name>فلزات</Name>
        <Item className="category__item" data-category="alkali-metal">
          فلزات قلیایی
        </Item>
        <Item className="category__item" data-category="alkaline-earth-metal">
          فلزات قلیایی خاکی
        </Item>
        <Item className="category__item" data-category="transition" light>
          فلزات واسطه
        </Item>
        <Item className="category__item" data-category="posttran">
          فلزات پس واسطه
        </Item>
        <Item className="category__item" data-category="lanthanide" light>
          لانتانید ها
        </Item>
        <Item className="category__item" data-category="actinide">
          اکتینید ها
        </Item>
      </Case>
      <Item
        className="category__item"
        as={Case}
        data-category="metalloid"
        style={{ height: "80%" }}
      >
        شبه فلزات
      </Item>
      <Case>
        <Name>نا فلزات</Name>
        <Item className="category__item" data-category="noble-gas">
          گاز های نجیب
        </Item>
        <Item className="category__item" data-category="nonmetal">
          غیر فلزات
        </Item>
      </Case>
      <Item
        className="category__item"
        as={Case}
        data-category="unknown"
        style={{ height: "80%" }}
      >
        ناشناخته ها
      </Item>
    </Category>
  );
}
