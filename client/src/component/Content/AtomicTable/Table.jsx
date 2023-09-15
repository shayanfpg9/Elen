//deps
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import styled, { css, ThemeProvider } from "styled-components";
import {
  json,
  Link,
  useLoaderData,
  useNavigate,
  useParams,
} from "react-router-dom";

//components
import Atom from "./Atom";
import Categories from "./Categories";
import Phase from "./Phase";
import Error from "../../Error/Error";

//libs & utils
import axios from "axios";
import { media } from "../../CssComponents/Util";
import { DB, message } from "../../funcs/funcs";
import { LoaderContext } from "../../Context/loader";
import { ThemeContext } from "../../Context/Theme";
import useSearch from "../../Hook/useSearch";

//row and cols same styles
const RowCol = styled.span`
  min-width: 1rem;
  min-height: 1rem;
  background-color: var(--color-bg);
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

//rows
const Row = styled(RowCol)`
  margin: 0.1rem 0.5rem;
  grid-row: ${(props) => +props.row};
`;

//cols
const Col = styled(RowCol)`
  margin: 0 0.1rem;
  margin-bottom: 1rem;
  grid-column: ${(props) => +props.col};
`;

const FreeSpace = styled.div`
  grid-column: 4;
  grid-row-start: 7;
  grid-row-end: 11;
  background-color: var(--color-text);
  border-radius: 1rem;
  position: relative;
  margin: 0.2rem 0.5rem;

  &::after {
    content: "";
    width: 0.5rem;
    min-height: calc(var(--first-fibo) / 2);
    font-size: 3rem;
    background-color: var(--color-fg);
    position: absolute;
    bottom: calc(var(--first-fibo) / 4);
    left: 50%;
    transform: translateX(-50%);
    border-radius: 1rem;
  }

  ${media(
    {
      "min-width": "xs",
      "max-width": "840px",
    },
    css`
      display: none;
    `
  )}
`;

export const TableLoader = async () => {
  const db = new DB("Atoms");

  const saved = await db.getAll();

  try {
    if (saved === undefined || saved.length === 0) {
      const data = (
        await axios.get("/api/atoms/", {
          headers: {
            Authorization: import.meta.env.VITE_API_KEY,
          },
        })
      ).data.data;

      await db.set(data);

      return data;
    } else return saved;
  } catch (error) {
    throw json(error.response.statusText, { status: error.response.status });
  }
};

export const SearchLoader = async ({ params }) => {
  try {
    const data = (
      await axios.post(
        "/api/atoms/search/",
        {
          query: Number.isNaN(+params.query) ? params.query : +params.query,
        },
        {
          headers: {
            Authorization: import.meta.env.VITE_API_KEY,
          },
        }
      )
    ).data.data.results;

    return data.map((info) => info.name);
  } catch (error) {
    throw json(error.response.statusText, { status: error.response.status });
  }
};

export default function Table() {
  const { t } = useTranslation("table");
  const error = useTranslation("error");
  const mount = useRef(false);
  const table = {
    cols: useRef(19),
    rows: useRef(9),
  };

  const [atoms, setData] = useState(null);
  const LoaderData = useLoaderData();
  const loaded = useContext(LoaderContext);
  const params = useParams();
  const [lastParams, setNewParam] = useState(undefined);
  const search = useSearch()[1];
  const [single, setSingle] = useState(false);
  const navigate = useNavigate();

  const GetDatas = async () => {
    let data;

    data = LoaderData;

    if (
      data?.bold !== undefined &&
      data?.bold.length === 1 &&
      typeof data.bold[0] === "string"
    ) {
      setSingle(true);
      navigate("/atom/" + data.bold);
    } else if (data !== undefined) {
      setData(
        data.all?.map((prop) => (
          <Atom
            className={
              data.bold
                ? data?.bold?.includes(prop.name)
                  ? "active"
                  : "hide"
                : ""
            }
            key={prop.name}
            {...prop}
          />
        ))
      );
    }

    loaded.hide();
  };

  const themeCon = useContext(ThemeContext);


  useEffect(() => {
    if (!mount.current) {
      GetDatas();

      mount.current = true;
    }
  }, []);

  useMemo(() => {
    if (lastParams !== undefined && lastParams.query !== params.query) {
      setNewParam(params);
      GetDatas();
    }
  }, [params.query]);

  const Active = () => {
    //run event in Update
    const CatPhase = document.querySelectorAll(".phase__item, .category__item");

    CatPhase.forEach((el) => {
      const prop = el?.dataset?.phase ? "phase" : "category";

      const Event = () => {
        search(
          {
            [prop]: el.dataset[prop],
          },
          false
        );
      };

      el.addEventListener("mouseenter", () => {
        Event();
      });

      el.addEventListener("mouseleave", () => {
        document.querySelectorAll(".Atom").forEach((el) => {
          el.classList.remove("hide", "active");
        });
      });
    });
  };

  const Cols = [];
  for (let i = 1; i < table.cols.current; i++) {
    Cols.push(
      <Col className="col" col={i + 1} children={i} key={`col-${i}`} />
    );
  }

  const Rows = [];
  for (let i = 1; i < table.rows.current; i++) {
    Rows.push(
      <Row className="row" row={i + 1} children={i} key={`row-${i}`} />
    );
  }

  if (single) {
    message(t("redirect"), "", "info");
    return (
      <>
        <h2>{t("redirect")}</h2>
      </>
    );
  } else if (atoms !== null) {
    Active();
    return (
      <ThemeProvider theme={{ name: themeCon.theme }}>
        {params?.query && <h2>{t("result")}:</h2>}

        <section className="table">
          {/* columns: */}
          {Cols}

          {/* rows: */}
          {Rows}

          <FreeSpace />

          {!params?.query && [
            <Categories key="category" />,
            <Phase key="phase" />,
          ]}

          {/* import datas */}
          {atoms}
        </section>

        {params?.query && <Link to="/table">{error.t("back-table")}</Link>}
      </ThemeProvider>
    );
  } else {
    return <Error code="404" msg={error.t("find")} />;
  }
}
