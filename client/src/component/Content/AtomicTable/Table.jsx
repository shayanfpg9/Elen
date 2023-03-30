//deps
import { Component } from "react";
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

//HOCs
import { WithMultiContext } from "../../HOC/WithMultiContext";
import { WithHook } from "../../HOC/WithHooks";

//libs & utils
import axios from "axios";
import { media } from "../../CssComponents/Util";
import _ from "lodash";
import { DB } from "../../funcs/funcs";
import { useTranslation } from "react-i18next";

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

export const TableLoader = async ({ refresh }) => {
  const db = new DB("Atoms");

  const saved = await db.getAll();

  try {
    if (refresh || _.isUndefined(saved) || saved.length === 0) {
      const data = (await axios.get("/api/atom")).data;

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
      await axios.post("/api/atom/search/", {
        q: params.query,
      })
    ).data.results;

    return data.map((info) => info.name);
  } catch (error) {
    throw json(error.response.statusText, { status: error.response.status });
  }
};

class Table extends Component {
  state = {
    cols: 19,
    rows: 9,
    atoms: null,
    theme: {
      name: this.props.Theme.theme,
    },
  };

  GetDatas = async (refresh = false) => {
    const loaded = this.props.Loaded;
    let data;

    loaded.show();

    if (refresh) {
      data = {
        all: await TableLoader({ refresh: true }),
        bold: this.props.params.query ? await SearchLoader() : undefined,
      };
    } else {
      data = this.props.loader;
    }

    if (
      data.bold !== undefined &&
      data.bold.length === 1 &&
      typeof data.bold[0] === "string"
    ) {
      this.props.navigate(`/atom/${data.bold[0]}`);
    }

    loaded.hide();

    if (data !== undefined) {
      this.setState({
        ...this.state,
        atoms: data.all?.map((prop) => (
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
        )),
      });
    }
  };

  setTheme = () => {
    const { theme } = this.props.Theme;

    if (theme === "system") {
      this.setState({
        theme: {
          name: this.props.Theme.theme,
          UnknownTransitionColor: {
            false: "var(--color-fg)",
            true: "var(--color-text)",
          },
          CategortItemColor: {
            true: "var(--color-text)",
            false: "var(--color-fg)",
          },
        },
      });
    } else if (theme === "dark") {
      this.setState({
        theme: {
          name: this.props.Theme.theme,
          UnknownTransitionColor: {
            true: "var(--color-fg)",
            false: "var(--color-text)",
          },
          CategortItemColor: {
            false: "var(--color-text)",
            true: "var(--color-fg)",
          },
        },
      });
    } else if (theme === "light") {
      this.setState({
        theme: {
          name: this.props.Theme.theme,
          UnknownTransitionColor: {
            false: "var(--color-fg)",
            true: "var(--color-text)",
          },
          CategortItemColor: {
            true: "var(--color-text)",
            false: "var(--color-fg)",
          },
        },
      });
    }
  };

  componentDidMount() {
    this.GetDatas();

    this.setTheme();
  }

  componentDidUpdate(pastProp) {
    if (this.props.Refresh.refresh) {
      this.props.Refresh.setRefresh(false);
      this.GetDatas(true);
    }

    if (pastProp.params.query !== this.props.params.query) {
      this.GetDatas();
    }

    if (this.state.theme.name !== this.props.Theme.theme) {
      this.setTheme();
    }

    //run event in Update for line:293
    const CatPhase = document.querySelectorAll(".phase__item, .category__item");

    if (CatPhase.length > 0 && !this.state.CatPhaseEvent) {
      this.setState({ CatPhaseEvent: true });

      CatPhase.forEach((el) => {
        const Event = () => {
          const prop = el?.dataset?.phase ? "phase" : "category";
          this.props.useSearch[1](
            {
              [prop]: el.dataset[prop],
            },
            false
          );
        };

        el.addEventListener("mouseenter", () => {
          Event();
        });
        el.addEventListener("mousemove", () => {
          Event();
        });
        el.addEventListener("mouseleave", () => {
          document.querySelectorAll(".Atom").forEach((el) => {
            el.classList.remove("hide", "active");
          });
        });
      });
    }
  }

  render() {
    const Cols = [];
    for (let i = 1; i < this.state.cols; i++) {
      Cols.push(
        <Col className="col" col={i + 1} children={i} key={`col-${i}`} />
      );
    }

    const Rows = [];
    for (let i = 1; i < this.state.rows; i++) {
      Rows.push(
        <Row className="row" row={i + 1} children={i} key={`row-${i}`} />
      );
    }

    if (!_.isNull(this.state.atoms)) {
      return (
        <ThemeProvider theme={this.state.theme}>
          {this.props?.params?.query && (
            <h2>{this.props.table.t("result")}:</h2>
          )}

          <section className="table">
            {/* columns: */}
            {Cols}

            {/* rows: */}
            {Rows}

            <FreeSpace />

            {!this.props?.params?.query && [
              <Categories key="category" />,
              <Phase key="phase" />,
            ]}

            {/* import datas */}
            {this.state.atoms}
          </section>

          {this.props?.params?.query && (
            <Link to="/table">{this.props.error.t("back-table")}</Link>
          )}
        </ThemeProvider>
      );
    } else {
      return <Error code="404" msg={this.props.error.t("find")} />;
    }
  }
}

export default WithHook(
  WithMultiContext(Table, ["Refresh", "Theme", "Loaded"]),
  [
    "useSearch",
    "useConfig",
    {
      name: "params",
      HookFunc: useParams,
    },
    {
      name: "navigate",
      HookFunc: useNavigate,
    },
    {
      name: "error",
      HookFunc: useTranslation,
      param: "error",
    },
    {
      name: "table",
      HookFunc: useTranslation,
      param: "table",
    },
    {
      name: "loader",
      HookFunc: useLoaderData,
    },
  ]
);
