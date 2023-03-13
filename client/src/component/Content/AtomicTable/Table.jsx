import axios from "axios";
import { Component } from "react";
import styled from "styled-components";
import { useSearch } from "../../Hook/hooks";
import Atom from "./Atom";
import Categories from "./Categories";
import Phase from "./Phase";

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
    min-height: var(--first-fibo);
    font-size: 3rem;
    background-color: var(--color-fg);
    position: absolute;
    bottom: calc(var(--first-fibo) / 4);
    left: 50%;
    transform: translateX(-50%);
    border-radius: 1rem;
  }
`;

export default class Table extends Component {
  state = {
    atoms: null,
  };

  componentDidMount() {
    //get datas with axios
    axios
      .get("/api/atom")
      .then(({ data }) => {
        data = data.map((prop) => {
          return <Atom key={prop.name} {...prop} />;
        });

        this.setState({ atoms: data });
      })
      .catch((e) => {
        console.log(e.title || e);
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
    return (
      <section className="table">
        {/* columns: */}
        <Col col="2">1</Col>
        <Col col="3">2</Col>
        <Col col="4">3</Col>
        <Col col="5">4</Col>
        <Col col="6">5</Col>
        <Col col="7">6</Col>
        <Col col="8">7</Col>
        <Col col="9">8</Col>
        <Col col="10">9</Col>
        <Col col="11">10</Col>
        <Col col="12">11</Col>
        <Col col="13">12</Col>
        <Col col="14">13</Col>
        <Col col="15">14</Col>
        <Col col="16">15</Col>
        <Col col="17">16</Col>
        <Col col="18">17</Col>
        <Col col="19">18</Col>

        {/* rows: */}
        <Row row="2">1</Row>
        <Row row="3">2</Row>
        <Row row="4">3</Row>
        <Row row="5">4</Row>
        <Row row="6">5</Row>
        <Row row="7">6</Row>
        <Row row="8">7</Row>
        <Row row="9">8</Row>
        <Row row="10">9</Row>

        <FreeSpace />
        <Categories />
        <Phase />

        {/* import datas */}
        {this.state.atoms !== null ? this.state.atoms : ""}
      </section>
    );
  }
}
