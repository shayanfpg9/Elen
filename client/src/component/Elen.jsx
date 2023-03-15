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
import { LoadedContext } from "./Context/Loaded";

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

      setTimeout(() => {
        this.setState({ stop: { remove: true } });
      }, 600);
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

        <LoadedContext.Provider value={{ ...this.loaded }}>
          <RefreshContext.Provider
            value={{
              refresh: this.state.refresh,
              setRefresh: this.setRefresh,
            }}
          >
            <Header></Header>
            <Content>
              <Routes>
                <Route path="/table" element={<Table />} />
                <Route
                  path="/table/:atom"
                  element={<Info loaded={this.loaded} />}
                />
              </Routes>
            </Content>
            <Footer></Footer>
          </RefreshContext.Provider>
        </LoadedContext.Provider>
      </Router>
    );
  }
}
