import { useTranslations } from "next-intl";
import { Box, Item } from "./css/Phase";
import { GiSolidLeaf, GiWaterDrop, GiGasPump } from "react-icons/gi";

export default function Phase() {
  const t = useTranslations("main.table");

  return (
    <Box>
      <Item data-phase="solid" className="phase__item">
        <GiSolidLeaf />
        {t("phase.solid")}
      </Item>
      <Item data-phase="liquid" className="phase__item">
        <GiWaterDrop />
        {t("phase.liquid")}
      </Item>
      <Item data-phase="gas" className="phase__item">
        <GiGasPump />
        {t("phase.gas")}
      </Item>
    </Box>
  );
}
