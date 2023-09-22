// Deps:
import axios from "@/functions/axios";
import { cache } from "react";

// Components:
import { Row, Col, FreeSpace } from "./components/css/Table";
import { notFound } from "next/navigation";
import Atom from "./components/Atom";
import Categories from "./components/Categories";
import Phase from "./components/Phase";

// import useNavigate from "@/app/hooks/useNavigate";
// import { useTranslations } from "next-intl";

export const revalidate = 60 * 60 * 24;

const GetAll = cache(async () => {
  const response = await axios.get("/atoms", {
    headers: {
      Authorization: process.env.API_KEY,
    },
  });

  if (response.status !== 200) {
    notFound();
  }

  return response.data.data;
});

async function Table({ params }) {
  // const t = useTranslations("main.table");
  // const error = useTranslations("main.error");
  // const navigate = useNavigate();
  const atoms = await GetAll();
  const table = {
    cols: 19,
    rows: 9,
  };

  const Cols = [];
  for (let i = 1; i < table.cols; i++) {
    Cols.push(
      <Col className="col" $col={i + 1} children={i} key={`col-${i}`} />
    );
  }

  const Rows = [];
  for (let i = 1; i < table.rows; i++) {
    Rows.push(
      <Row className="row" $row={i + 1} children={i} key={`row-${i}`} />
    );
  }

  // if (single) {
  //   message(t("redirect"), "", "info");
  //   return (
  //     <>
  //       <h2>{t("redirect")}</h2>
  //     </>
  //   );
  // } else
  if (atoms !== null) {
    return (
      <>
        <section className="table">
          {/* columns: */}
          {Cols}
          {/* rows: */}
          {Rows}
          <FreeSpace />
          <Categories key="category" />
          <Phase key="phase" />
          {atoms.map((prop) => (
            <Atom key={prop.name} {...prop} />
          ))}
        </section>
      </>
    );
  }
  //  else {
  //   return <Error code="404" msg={error.t("find")} />;
  // }
}

export default Table;
