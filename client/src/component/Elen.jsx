import { Component } from "react";
import "../styles/Main.scss";
import Table from "./Content/AtomicTable/Table";
import Content from "./Content/Content";
import Info from "./Content/Info/Info";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default class Elen extends Component {
  render() {
    return (
      <Router>
        <Header></Header>
        <Content>
          <Routes>
            <Route path="/table" element={<Table />} />
            <Route path="/table/:atom" element={<Info />} />
          </Routes>
        </Content>
        <Footer></Footer>
      </Router>
    );
  }
}
