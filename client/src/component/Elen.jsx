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
import { ThemeContext } from "./Context/Theme";
import _ from "lodash";
import Error from "./Error/Error";
import Search from "./Header/Search";
import DB from "./funcs/DB";

export default class Elen extends Component {
  state = {
    stop: {
      show: true,
      remove: false,
    },
    theme: localStorage.getItem("theme-mode"),
  };

  componentDidMount() {
    document.body.classList.add(this.state.theme);

    new DB().init("Atoms", "Single");

    if (_.isNull(this.state.theme)) {
      localStorage.setItem("theme-mode", "system");

      this.setTheme(localStorage.getItem("theme-mode"));
    }

    window
      ?.matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (this.theme === "system") this.setTheme("system");
      });
  }

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

  setTheme = (theme) => {
    document.body.classList.remove("dark", "light", "system");
    document.body.classList.add(theme);

    this.setState({
      theme,
    });

    localStorage.setItem("theme-mode", theme);
  };

  render() {
    return (
      <Router>
        <ThemeContext.Provider
          value={{
            theme: this.state.theme,
            setTheme: this.setTheme,
          }}
        >
          {!this.state.stop.remove && <Loader stop={!this.state.stop.show} />}

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
                  <Route path="/table/find/:query" element={<Table />} />
                  <Route path="/table/find/" element={<Search single />} />
                  <Route
                    path="/atom/:atom"
                    element={<Info loaded={this.loaded} />}
                  />
                  <Route
                    path="*"
                    element={<Error code="404" msg="صفحه یافت نشد" />}
                  />
                </Routes>
              </Content>
              <Footer></Footer>
            </RefreshContext.Provider>
          </LoadedContext.Provider>
        </ThemeContext.Provider>
      </Router>
    );
  }
}
