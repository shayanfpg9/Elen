import { useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { LoadedContext } from "../Context/Loaded";

export default function Error(props) {
  const { t } = useTranslation("error");
  const { hide } = useContext(LoadedContext);
  const  unMount = useRef(true)

  useEffect(() => {
    if (props.loaded && unMount.current) {
      hide();
      unMount.current = false
    }
  });

  return (
    <section className="error">
      <div className="error__box">
        <h2>
          {t("error")} {props.code}:
        </h2>
        <h3>{props.msg}</h3>
        <Link to="/">{t("back")}</Link>
        <br />
        {t("or")}
        <br />
        <Link to="/table/find">{t("search")}</Link>
      </div>
    </section>
  );
}
