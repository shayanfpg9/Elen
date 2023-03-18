import { useTranslation } from "react-i18next";
import styled, { css } from "styled-components";
import flex from "../../CssComponents/Flexbox";
import { colors, media } from "../../CssComponents/Util";

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
      "max-width": "840px",
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
  const { t } = useTranslation("table");

  return (
    <Category>
      <Case>
        <Name>{t("categories.metal")}</Name>
        <Item className="category__item" data-category="alkali-metal">
          {t("categories.alkali-metal")}
        </Item>
        <Item className="category__item" data-category="alkaline-earth-metal">
          {t("categories.alkaline-earth-metal")}
        </Item>
        <Item className="category__item" data-category="transition" light>
          {t("categories.transition")}
        </Item>
        <Item className="category__item" data-category="posttran">
          {t("categories.posttran")}
        </Item>
        <Item className="category__item" data-category="lanthanide" light>
          {t("categories.lanthanide")}
        </Item>
        <Item className="category__item" data-category="actinide">
          {t("categories.actinide")}
        </Item>
      </Case>
      <Item
        className="category__item"
        as={Case}
        data-category="metalloid"
        style={{ height: "80%" }}
      >
        {t("categories.metalloid")}
      </Item>
      <Case>
        <Name>{t("categories.nometal")}</Name>
        <Item className="category__item" data-category="noble-gas">
        {t("categories.noble-gas")}
        </Item>
        <Item className="category__item" data-category="nonmetal">
        {t("categories.nometal")}
        </Item>
      </Case>
      <Item
        className="category__item"
        as={Case}
        data-category="unknown"
        style={{ height: "80%" }}
      >
        {t("categories.unknown")}
      </Item>
    </Category>
  );
}
