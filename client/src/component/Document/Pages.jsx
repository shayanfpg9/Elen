//deps
import { useContext } from "react";
import { Link, useParams } from "react-router-dom";

//hooks
import { useTranslation } from "react-i18next";

//context
import { DocumentContext } from "../Context/Document";

//utils
import { flatMap } from "lodash";
import styled, { css } from "styled-components";
import media from "../CssComponents/Media";

//datas
import similar from "../../translate/langs/pages/similar.json";
import Error from "../Error/Error";

const A = styled(Link)`
  display: block;
  width: 70%;
  text-align: center;
  text-decoration: none;
  font-size: 1.5rem;
  background-color: var(--color-bg);
  padding: 1rem;
  border-radius: 1rem;
  margin: 2rem 0;
  transition: all 1s var(--animation);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0px 0.5rem 1rem 2px rgba(var(--color-bg-rgb), 0.7);
  }
`;

const Code = styled.code`
  direction: ltr !important;
  background-color: var(--color-bg);
  padding: ${(props) => (props.small ? "0.5rem;" : "1rem")};
  border-radius: 1rem;
  margin: 1rem 0;
  width: 90%;

  ${media(
    {
      "max-width": "sm",
    },
    css`
      overflow-x: scroll;
    `
  )};
`;

export default function DocumentPages() {
  const { method, action } = useParams();
  const path = `${method || ""}/${action || ""}`;
  const { t } = useTranslation("pages");
  const FirstSection = useContext(DocumentContext)[1];

  if (t(`${path}.text`) !== `${path}.text`) {
    return (
      <>
        <h1>{t(`${path}.title`)}</h1>
        {similar[path]?.api &&
          (!Array.isArray(similar[path]?.api)
            ? [similar[path]?.api]
            : similar[path]?.api
          ).map((api, i) => (
            <Code small key={`code-${i}`}>
              {AddBr(api)}
            </Code>
          ))}

        <p>{AddBr(t(`${path}.text`), false)}</p>

        {similar[path]?.output && (
          <Code>{AddBr(similar[path].output.replace(/\/\//g, " //"))}</Code>
        )}

        {similar[path]?.error && (
          <>
            <h2> {t("config.error")}:</h2>
            <Code>{AddBr(similar[path].error.replace(/\/\//g, " //"))}</Code>
          </>
        )}

        {method === undefined && action === undefined && (
          <A to={FirstSection.path}>{t(`${FirstSection.path}.name`)}</A>
        )}
      </>
    );
  } else {
    return <Error loaded style={{ position: "relative" }} />;
  }
}

function AddBr(string, code = true) {
  return (
    flatMap(string.split(/\n/g), (value, index, array) =>
      array.length - 1 !== index
        ? [
            value + (index !== 0 && code ? "," : ""),
            <br key={`br-${index}-${string}`} />,
          ]
        : value
    ) || string
  );
}
