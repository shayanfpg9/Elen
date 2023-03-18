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
import { LangContext } from "./Context/Lang";
import _ from "lodash";
import Error from "./Error/Error";
import Search from "./Header/Search";
import DB from "./funcs/DB";
import { WithHook } from "./HOC/WithHooks";
import { useTranslation } from "react-i18next";

class Elen extends Component {
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

    if (!localStorage.getItem("language")) {
      const langs = window.navigator.languages;

      if (langs.includes("fa")) {
        this.setLang("fa");
      } else if (langs.includes("en")) {
        this.setLang("en");
      }
    } else {
      this.setLang(localStorage.getItem("language"));
    }
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

  setLang = (lang) => {
    if (["en", "fa"].includes(lang)) {
      document.documentElement.classList.remove("ltr", "rtl");

      const { i18n } = this.props.translate;

      i18n.changeLanguage(lang);

      if (lang === "en") {
        document.documentElement.classList.add("ltr");
      } else {
        document.documentElement.classList.add("rtl");
      }

      localStorage.setItem("language", lang);
    }
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
              <LangContext.Provider value={this.setLang}>
                <Header></Header>
              </LangContext.Provider>
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
                    element={
                      <Error
                        code="404"
                        msg={this.props.translate.t("page")}
                        loaded
                      />
                    }
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

export default WithHook(Elen, [
  {
    name: "translate",
    HookFunc: useTranslation,
    param: "error",
  },
]);
