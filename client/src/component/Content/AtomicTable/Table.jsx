import axios from "axios";
import { Component } from "react";
import styled, { css, ThemeProvider } from "styled-components";
import Atom from "./Atom";
import Categories from "./Categories";
import Phase from "./Phase";
import { media } from "../CssComponents/Util";
import _ from "lodash";
import { WithMultiContext } from "../../HOC/WithMultiContext";
import { WithHook } from "../../HOC/WithHooks";
import { Link, useNavigate, useParams } from "react-router-dom";
import Error from "../../Error/Error";
import { DB, equal, message } from "../../funcs/funcs";
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
      "max-width": "830px",
    },
    css`
      display: none;
    `
  )}
`;

class Table extends Component {
  state = {
    cols: 19,
    rows: 9,
    atoms: null,
    theme: {
      name: this.props.Theme.theme,
    },
    location: window?.location.href,
  };

  GetDatas = async (refresh) => {
    this.props.Loaded.show();

    const db = new DB("Atoms");

    await db.getAll(async (res) => {
      if (
        equal(res, []) ||
        Boolean(refresh) ||
        Boolean(this.props?.params?.query)
      ) {
        let data;

        try {
          if (this.props?.params?.query) {
            //search all of the atoms with "this.props.params.atom" property
            data = (
              await axios.post("/api/atom/search", {
                q: this.props.params.query,
              })
            ).data.results;
          } else {
            //get datas with axios
            data = (await axios.get("/api/atom")).data;
          }
        } catch (e) {
          this.props.Loaded.hide();

          this.setState({
            atoms: null,
          });
        }

        if (!Array.isArray(data) || data.length === 1) {
          if (Array.isArray(data)) data = data[0];

          this.props.navigate(`/atom/${data.name}`);
        } else {
          if (!this.props?.params?.query) {
            db.set(data);
          }

          data = data?.map((prop) => <Atom key={prop.name} {...prop} />);

          this.props.Loaded.hide();

          if (refresh) {
            message(this.props.table.t("messages.refresh"));
          } else if (!Boolean(this.props?.params?.query)) {
            message(
              this.props.table.t("messages.save.title"),
              this.props.table.t("messages.save.msg")
            );
          }

          this.setState({
            atoms: data,
            cols: this.state.cols,
            rows: this.state.rows,
          });
        }
      } else {
        this.props.Loaded.hide();

        res = res?.map((prop) => <Atom key={prop.name} {...prop} />);

        this.setState({
          atoms: res,
          cols: this.state.cols,
          rows: this.state.rows,
        });
      }
    });
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

  async componentDidMount() {
    await this.GetDatas();

    this.setTheme();
  }

  async componentDidUpdate() {
    if (this.props.Refresh.refresh) {
      this.props.Refresh.setRefresh(false);
      await this.GetDatas(true);
    }

    if (this.state.location !== window?.location.href) {
      this.setState({
        location: window?.location.href,
      });
      await this.GetDatas();
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
  ]
);
