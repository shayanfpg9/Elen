// Deps:
import generate from "@/functions/generateMetadata";
import { useTranslations } from "next-intl";

// Components:
import {
  Section,
  Title,
  Img,
  List,
  Item,
  Icon,
  A,
  P,
} from "./components/css/home";
import Writer from "./components/writer";
import Image from "next/image";
import Banner from "@/assets/banner.webp";

// Icons:
import {
  BsFillPhoneFill,
  BsSpeedometer2,
  BsSunglasses,
  BsTranslate,
} from "react-icons/bs";
import { FaMoneyBillWave } from "react-icons/fa";
import { RiOpenSourceFill } from "react-icons/ri";

export const generateMetadata = async ({ params: { locale } }) =>
  await generate("home", locale);

function Home() {
  const t = useTranslations("main.home");

  return (
    <>
      <Section>
        <Writer text={t("effect")} as={Title} />
        <Img alt={t("effect")} as={Image} src={Banner} placeholder="blur" />
      </Section>

      <Section>
        <Title>{t("why")}</Title>

        <List>
          <Item>
            <Icon children={<BsTranslate />} />
            <h3>{t("list.translate.title")}</h3>
            <span>{t("list.translate.msg")}</span>
          </Item>
          <Item>
            <Icon children={<BsSpeedometer2 />} />
            <h3>{t("list.fast.title")}</h3>
            <span>{t("list.fast.msg")}</span>
          </Item>
          <Item>
            <Icon children={<BsSunglasses />} />
            <h3>{t("list.cute.title")}</h3>
            <span>{t("list.cute.msg")}</span>
          </Item>
          <Item>
            <Icon children={<BsFillPhoneFill />} />
            <h3>{t("list.responsive.title")}</h3>
            <span>{t("list.responsive.msg")}</span>
          </Item>
          <Item>
            <Icon children={<FaMoneyBillWave />} />
            <h3>{t("list.free.title")}</h3>
            <span>{t("list.free.msg")}</span>
          </Item>
          <Item>
            <Icon children={<RiOpenSourceFill />} />
            <h3>{t("list.opensource.title")}</h3>
            <span>{t("list.opensource.msg")}</span>
          </Item>
        </List>
      </Section>

      <Section>
        <Title>{t("join")}</Title>
        <A href="/table">{t("btn-join")}</A>
      </Section>

      <Section>
        <Title>{t("develope")}</Title>
        <Title as="h4" $fs="1.2rem" $xl="1.5rem">
          {t("span-develope")}
        </Title>
        <A href="/document">{t("document")}</A>
      </Section>

      <Section>
        <Title>{t("whereis")}</Title>
        <P>{t("about")}</P>
      </Section>

      <Section>
        <A href="mailto:shayanfpg9@duck.com">{t("contact-me")}</A>
      </Section>
    </>
  );
}

export default Home;
