//deps
import { Component } from "react";
import { Outlet } from "react-router-dom";

//styles
import "../styles/Main.scss";

//components
import Content from "./Content/Content";
import Footer from "./Footer/Footer";
import Header from "./Header/Header";

//contexts
import Loader from "./Loader/Loader";
import { RefreshContext } from "./Context/Refresh";
import { LoadedContext } from "./Context/Loaded";
import { ThemeContext } from "./Context/Theme";
import { LangContext } from "./Context/Lang";

//libs & utils
import _ from "lodash";
import DB from "./funcs/DB";
import { WithHook } from "./HOC/WithHooks";
import { useTranslation } from "react-i18next";
import i18n from "../translate/i18n";

export const InitLoader = async () => {
  const stores = ["Atoms", "Single"];
  const init = await new DB().init(...stores);

  if (!localStorage.getItem("language")) {
    const langs = window.navigator.languages;

    if (langs.includes("fa")) {
      i18n.changeLanguage("fa");
    } else if (langs.includes("en")) {
      i18n.changeLanguage("en");
    }
  } else {
    i18n.changeLanguage(localStorage.getItem("language"));
  }

  if (init.length === stores.length) {
    return true;
  }

  return false;
};

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

    if (_.isNull(this.state.theme)) {
      localStorage.setItem("theme-mode", "system");

      this.setTheme(localStorage.getItem("theme-mode"));
    }

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
            <Content>{!this.props.use ? <Outlet /> : this.props.use}</Content>
            <Footer></Footer>
          </RefreshContext.Provider>
        </LoadedContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

export default WithHook(Elen, [
  {
    name: "translate",
    HookFunc: useTranslation,
  },
]);
