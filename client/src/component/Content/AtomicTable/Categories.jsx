import styled, { css } from "styled-components";
import flex from "../CssComponents/Flexbox";
import { colors, media } from "../CssComponents/Util";

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
  ${flex({
    FFlow: "column wrap",
  })}
  writing-mode: tb-rl;
  position: relative;
  margin: 0.2rem 0.5rem;
  cursor: default;

  ${media(
    {
      "min-width": "xs",
      "max-width": "830px",
    },
    css`
      position: absolute;
      bottom: calc(var(--first-fibo) * 2 + 1rem);
      width: 90%;
      left: 50%;
      transform: translateX(-50%);
      margin: 0.2rem 0;
    `
  )}

  ${media(
    {
      "min-width": "xs",
      "max-width": "510px",
    },
    css`
      max-height: 50vh;
      bottom: calc(var(--first-fibo) * 2.5 + 1rem);
      width: 90%;
      height: calc(var(--first-fibo) * 4);

      ${Name} {
        display: none;
      }
    `
  )}

  ${media(
    {
      "min-width": "xs",
      "max-width": "370px",
    },
    css`
      display: none;
    `
  )}
`;

const Case = styled.div`
  ${flex({
    FFlow: "column wrap",
  })}
  height: 75%;
  padding-top: 0.5rem;
`;

const Item = styled.span.attrs((props) => ({
  title: props.children,
  "aria-label": props.children,
}))`
  background-color: ${(props) =>
    colors[props["data-category"].replace(/-/g, " ")]};
  height: 100%;
  border-radius: 5px;
  margin: 0 0.1rem;
  color: ${(props) =>
    props.light
      ? props.theme?.CategortItemColor.true
      : props.theme?.CategortItemColor.false};
  cursor: pointer;
  padding: 0.2rem 0;

  ${(props) =>
    props.theme.name === "system" &&
    media(
      { "prefers-color-scheme": "dark" },
      css`
        color: ${(props) =>
          !props.light ? "var(--color-text)" : "var(--color-fg)"};
      `
    )}
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
