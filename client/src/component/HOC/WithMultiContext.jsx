import { Component } from "react";
import { LoadedContext } from "../Context/Loaded";
import { RefreshContext } from "../Context/Refresh";

const AllContexts = {
  Loaded: LoadedContext,
  Refresh: RefreshContext,
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
    return CTP(WithMultiContext(ActionCmponent, Context.shift()), Context[0]);
  }
}
