import { Component } from "react";
import "../styles/Main.scss";
import Table from "./Content/AtomicTable/Table";
import Content from "./Content/Content";
import Info from "./Content/Info/Info";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loader from "./Loader/Loader";
import { RefreshContext } from "./Context/Refresh";

Table.contextType = RefreshContext;

export default class Elen extends Component {
  state = {
    stop: {
      show: true,
      remove: false,
    },
  };

  loaded = {
    hide: () => {
      this.setState({ stop: { show: false } });
    },
    remove: () => {
      this.setState({ stop: { remove: true } });
    },
    show: () => {
      this.setState({ stop: { show: true, remove: false } });
    },
  };

  setRefresh = (value) => {
    this.setState({
      refresh: value,
    });
  };

  render() {
    return (
      <Router>
        {this.state.stop.remove ? "" : <Loader stop={!this.state.stop.show} />}

        <RefreshContext.Provider value={[this.state.refresh, this.setRefresh]}>
          <Header></Header>
          <Content>
            <Routes>
              <Route path="/table" element={<Table loaded={this.loaded} />} />
              <Route
                path="/table/:atom"
                element={<Info loaded={this.loaded} />}
              />
            </Routes>
          </Content>
          <Footer></Footer>
        </RefreshContext.Provider>
      </Router>
    );
  }
}
