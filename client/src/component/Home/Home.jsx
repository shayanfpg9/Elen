import { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { LoadedContext } from "../Context/Loaded";
import styled, { css } from "styled-components";
import flex from "../CssComponents/Flexbox";
import media from "../CssComponents/Media";
import { useWriteEffect } from "../Hook/hooks";
import banner from "../../asset/banner.jpg";
import {
  BsFillPhoneFill,
  BsSpeedometer2,
  BsSunglasses,
  BsTranslate,
} from "react-icons/bs";
import { FaMoneyBillWave } from "react-icons/fa";
import { RiOpenSourceFill } from "react-icons/ri";

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

const Title = styled.h2`
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

const A = styled(Link)`
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

const P = styled.p`
  font-size: 1.5rem;
`;

export default function Home() {
  const loaded = useContext(LoadedContext);
  const Mount = useRef(false);
  const WritingEffect = useWriteEffect("با الن دنیای اتم ها رو بهتر بشناس:");

  useEffect(() => {
    if (!Mount.current) {
      Mount.current = true;
      loaded.hide();
    }
  });

  return (
    <>
      <Section>
        <Title>{WritingEffect.text}</Title>
        <Img src={banner} />
      </Section>

      <Section>
        <Title>چرا فقط الن ؟</Title>

        <List>
          <Item>
            <Icon as={BsTranslate} />
            <h3>کاملا فارسی</h3>
            <span>اطلاعات دقیق اما فارسی چیزی که کم پیدا میشه</span>
          </Item>
          <Item>
            <Icon as={BsSpeedometer2} />
            <h3>خیلی سریع</h3>
            <span>فقط لازمه یک باز برای لود شدنش صبر کنی</span>
          </Item>
          <Item>
            <Icon as={BsSunglasses} />
            <h3>جذاب</h3>
            <span>ظاهر فوق العاده برای یادگیری با انگیزه ی بیشتر</span>
          </Item>
          <Item>
            <Icon as={BsFillPhoneFill} />
            <h3>واکنش گرا</h3>
            <span>همه جا میتونی ازش استفاده کنی</span>
          </Item>
          <Item>
            <Icon as={FaMoneyBillWave} />
            <h3>رایگان</h3>
            <span>چرا داری به دشمنات پول میدی؟</span>
          </Item>
          <Item>
            <Icon as={RiOpenSourceFill} />
            <h3>اپن سورس</h3>
            <span>از api الن تو اپلیکیشن بعدیت استفاده کن</span>
          </Item>
        </List>
      </Section>

      <Section>
        <Title>همین حالا شروع کن و دنیای اتم ها رو بشناس</Title>
        <A to="/table">بزن بریم</A>
      </Section>

      <Section>
        <Title>برنامه نویسی؟</Title>
        <Title as="h4" fs="1.2rem" fsXl="1.5rem">
          اینجا برای تو هم جا هست، می‌تونی اپلیکیشنتو توسعه بدی
        </Title>
        <A to="/document">یه سری به دایکیومنت api بزن</A>
      </Section>

      <Section>
        <Title>اینجا کجاست؟</Title>
        <P>
          الن یک پروژه ی اپن-سورس کاملا ایرانی، پویا و واکنش گراست که برای مردم
          همه جای دنیا طراحی شده و تمام آدما میتونن باهاش دنیای اتم های رو یاد
          بگیرن این سایت دارای یک api خوب هستش که باهاش میتونین اطلاعات رو به
          تمام زبان ها به کمک گوگل ترنسلیت ترجمه کنید و توی کار هاتون ازش
          استفاده کنین.
          <br />
          این پروژه با expressJS و react و چند تا کتابخونه ی دیگه طراحی شده و از
          یک دیتابیس NoSQL خیلی خوب برای ذخیره ی اطلاعات استفاده میکنه، همچنین
          با بارگذاری اولیه اطلاعات کش میشن و شما دیگه نیاز نیست برای ترجمه
          شدنشون صبر کنین.
          <br />
          همین حالا وقتتون رو با سایت های خارجی هدر ندین و به وسیله ی لینک بالا
          از اطلاعات این سایت استفاده کنین.
        </P>
      </Section>
    </>
  );
}
