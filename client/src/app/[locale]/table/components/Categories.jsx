import { useTranslations } from "next-intl";
import { Name, Category, Case, Item } from "./css/Categories";

export default function Categories() {
  const t = useTranslations("main.table");

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
        <Item className="category__item" data-category="transition" reverse>
          {t("categories.transition")}
        </Item>
        <Item className="category__item" data-category="post_transition">
          {t("categories.post_transition")}
        </Item>
        <Item className="category__item" data-category="lanthanide" reverse>
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
