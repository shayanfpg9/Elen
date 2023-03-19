import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LoadedContext } from "../Context/Loaded";
import styled, { css } from "styled-components";
import flex from "../CssComponents/Flexbox";
import media from "../CssComponents/Media";
import { writeEffect } from "../funcs/funcs";
import banner from "../../asset/banner.jpg";
import {
  BsFillPhoneFill,
  BsSpeedometer2,
  BsSunglasses,
  BsTranslate,
} from "react-icons/bs";
import { FaMoneyBillWave } from "react-icons/fa";
import { RiOpenSourceFill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import _ from "lodash";

const Section = styled.section`
  width: 100%;
  min-height: 50vh;
  color: var(--color-text);
  text-aitemgn: center;
  margin-bottom: 10vh;
  position: relative;
  overflow: visible;

  ${flex({
    AItemgnItems: "flex-start",
  })};
`;

const Title = styled.h2.attrs((props) => ({ title: props.children }))`
  font-size: ${(props) => props.fs || "2rem"};
  position: relative;
  padding-left: 5px;
  width: 100%;
  margin-bottom: 1rem;

  ${media(
    { "min-width": "xl" },
    css`
      font-size: ${(props) => props.fsXl || "2.2rem"};
    `
  )}
`;

const Img = styled.img.attrs((props) => ({
  alt: props.src,
}))`
  width: calc(var(--first-fibo) * 8);
  height: auto;
  border-radius: 1rem;
  box-shadow: 0px 0.5rem 1rem 5px var(--color-bg);
  margin: 0 1rem;
  position: relative;
  top: 0;
  left: 0;
`;

const List = styled.ul`
  width: 100%;
  min-height: 30vh;
  itemst-style-type: none;
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-template-rows: repeat(3, auto);
  gap: 2rem 1rem;
  padding: 0.5rem 1rem;

  ${media(
    {
      "max-width": "md",
    },
    css`
      grid-template-columns: auto;
      grid-template-rows: repeat(6, auto);
      padding: 2rem;
    `
  )}
`;

const Item = styled.li`
  text-align: center;
  cursor: pointer;
  border-radius: 1rem;
  transition: all 1s var(--animation);

  &:hover {
    transform: scale(1.1);
    background-color: var(--color-bg);
    padding: 0.5rem;
    box-shadow: 0px 0.5rem 1rem 2px var(--color-bg);
  }
`;

const Icon = styled.i`
  font-size: 2rem;
`;

const A = styled(Link).attrs((props) => ({ title: props.children }))`
  width: 90%;
  text-align: center;
  text-decoration: none;
  font-size: 2rem;
  background-color: var(--color-bg);
  padding: 1rem;
  border-radius: 1rem;
  transition: all 1s var(--animation);

  &:hover {
    transform: translateY(-1rem);
    box-shadow: 0px 0.5rem 1rem 2px rgba(var(--color-bg-rgb),.7)};
  }
`;

const P = styled.p.attrs((props) => ({
  title: props.children.slice(0, 50).trim() + "...",
}))`
  font-size: 1.5rem;
`;

export default function Home() {
  const { t, i18n } = useTranslation("home");
  const loaded = useContext(LoadedContext);
  const Mount = useRef(false);
  const [lang, setLang] = useState(null);
  const TextEffect = useRef();
  const WriteEffect = new writeEffect().effect;

  useEffect(() => {
    if (_.isNull(lang)) {
      setLang(i18n.language);
    }

    if (!Mount.current) {
      Mount.current = true;

      loaded.hide();

      TextEffect.current.innerHTML = "";

      WriteEffect(TextEffect.current, t("effect"));
      setLang(i18n.language);
    } else if (i18n.language !== lang && !_.isNull(lang)) {
      TextEffect.current.setAttribute("changed", true);
      TextEffect.current.innerHTML = t("effect");
      setLang(i18n.language);
    }
  }, [t, loaded, WriteEffect, i18n.language, lang]);

  return (
    <>
      <Section>
        <Title ref={TextEffect}></Title>
        <Img src={banner} />
      </Section>

      <Section>
        <Title>{t("why")}</Title>

        <List>
          <Item>
            <Icon as={BsTranslate} />
            <h3>{t("list.translate.title")}</h3>
            <span>{t("list.translate.msg")}</span>
          </Item>
          <Item>
            <Icon as={BsSpeedometer2} />
            <h3>{t("list.fast.title")}</h3>
            <span>{t("list.fast.msg")}</span>
          </Item>
          <Item>
            <Icon as={BsSunglasses} />
            <h3>{t("list.cute.title")}</h3>
            <span>{t("list.cute.msg")}</span>
          </Item>
          <Item>
            <Icon as={BsFillPhoneFill} />
            <h3>{t("list.responsive.title")}</h3>
            <span>{t("list.responsive.msg")}</span>
          </Item>
          <Item>
            <Icon as={FaMoneyBillWave} />
            <h3>{t("list.free.title")}</h3>
            <span>{t("list.free.msg")}</span>
          </Item>
          <Item>
            <Icon as={RiOpenSourceFill} />
            <h3>{t("list.opensource.title")}</h3>
            <span>{t("list.opensource.msg")}</span>
          </Item>
        </List>
      </Section>

      <Section>
        <Title>{t("join")}</Title>
        <A to="/table">{t("btn-join")}</A>
      </Section>

      <Section>
        <Title>{t("develope")}</Title>
        <Title as="h4" fs="1.2rem" fsXl="1.5rem">
          {t("span-develope")}{" "}
        </Title>
        <A to="/document">{t("document")}</A>
      </Section>

      <Section>
        <Title>{t("whereis")}</Title>
        <P>{t("about")}</P>
      </Section>
    </>
  );
}
