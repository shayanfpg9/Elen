import { Component } from "react";
import { ThemeContext } from "../Context/Theme";
import { LoadedContext } from "../Context/Loaded";
import { RefreshContext } from "../Context/Refresh";

const AllContexts = {
  Loaded: LoadedContext,
  Refresh: RefreshContext,
  Theme: ThemeContext,
};

const CTP = (ActionCmponent, Context) =>
  class extends Component {
    state = {
      Context:
        AllContexts[Context] ||
        Context.map((i) => {
          return AllContexts[i];
        }),
    };

    render() {
      return (
        <this.state.Context.Consumer>
          {(res) => <ActionCmponent {...{ [Context]: res }} {...this.props} />}
        </this.state.Context.Consumer>
      );
    }
  };

export function WithMultiContext(ActionCmponent, Context) {
  if (typeof Context === "string") {
    return CTP(ActionCmponent, Context);
  } else if (Context.length === 1) {
    return CTP(ActionCmponent, Context[0]);
  } else if (Array.isArray(Context)) {
    let result;

    for (let i = 0; i < Context.length; i++) {
      if (i === 0) {
        result = CTP(ActionCmponent, Context[i]);
      } else {
        result = CTP(result, Context[i]);
      }
    }

    return result;
  }
}
