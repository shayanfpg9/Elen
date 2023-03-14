import axios from "axios";
import { Component } from "react";
import styled, { css } from "styled-components";
import { useSearch } from "../../Hook/hooks";
import Atom from "./Atom";
import Categories from "./Categories";
import Phase from "./Phase";
import { media } from "../CssComponents/Util";

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
const Row = styled(RowCol).attrs({
  role: "rowheader",
})`
  margin: 0.1rem 0.5rem;
  grid-row: ${(props) => +props.row};
`;

//cols
const Col = styled(RowCol).attrs({
  role: "columnheader",
})`
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
    min-height: var(--first-fibo);
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

export default class Table extends Component {
  state = {
    cols: 19,
    rows: 9,
    atoms: null,
  };

  async componentDidMount() {
    //get datas with axios
    let data = (await axios.get("/api/atom")).data;

    data = data.map((prop) => {
      return <Atom key={prop.name} {...prop} />;
    });

    this.setState({
      atoms: data,
      cols: this.state.cols,
      rows: this.state.rows,
    });
  }

  componentDidUpdate() {
    //note: useSearch isn't a valid hook and is just a Js function but we use it as a hook
    document.querySelectorAll(".phase__item, .category__item").forEach((el) => {
      const Event = () => {
        const prop = el?.dataset?.phase ? "phase" : "category";
        useSearch(
          {
            [prop]: el.dataset[prop],
          },
          false
        );
      };

      el.addEventListener("mouseenter", Event);
      el.addEventListener("mousemove", Event);
      el.addEventListener("mouseleave", () => {
        document.querySelectorAll(".Atom").forEach((el) => {
          el.classList.remove("hide", "active");
        });
      });
    });
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

    return (
      <section className="table">
        {/* columns: */}
        {Cols}

        {/* rows: */}
        {Rows}

        <FreeSpace />
        <Categories />
        <Phase />

        {/* import datas */}
        {this.state.atoms !== null ? this.state.atoms : ""}
      </section>
    );
  }
}
