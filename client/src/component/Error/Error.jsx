//deps
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useRouteError } from "react-router-dom";

//context
import { LoaderContext } from "../Context/loader";

//hook
import { useTranslation } from "react-i18next";

export default function Error(props) {
  const { t } = useTranslation("error");
  const { hide } = useContext(LoaderContext);
  const unMount = useRef(true);
  const [errorProps, setErrors] = useState(useRouteError());

  useEffect(() => {
    if (props.loaded && unMount.current) {
      if (errorProps === undefined) {
        setErrors({
          status: props.code || 404,
          data: props.msg || "",
        });
      } else {
        setErrors({
          ...errorProps,
          data: errorProps.data.replaceAll(`"`, ""),
        });
      }

      hide();
      unMount.current = false;
    }
  }, [setErrors, hide, unMount, errorProps, props]);

  return (
    <section className="error" style={props.style}>
      <div className="error__box">
        <h2>
          {t("error")} {errorProps?.status || 500}:
        </h2>
        <h3>{errorProps?.data}</h3>
        <Link to="/">{t("back")}</Link>
        <br />
        {t("or")}
        <br />
        <Link to="/table/find">{t("search")}</Link>
        <br />
        {t("or")}
        <br />
        <a href={"?i=" + Date.now()}>{t("refresh")}</a>
      </div>
    </section>
  );
}
