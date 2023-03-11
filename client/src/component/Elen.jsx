import { Component } from "react";
import "../styles/Main.scss";
import Table from "./Content/AtomicTable/Table";
import Content from "./Content/Content";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";

export default class Elen extends Component {
  render() {
    return (
      <>
        <Header></Header>
        <Content>
          <Table></Table>
        </Content>
        <Footer></Footer>
      </>
    );
  }
}
