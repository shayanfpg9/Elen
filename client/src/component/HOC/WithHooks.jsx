import * as hooks from "../Hook/hooks";

const HTP = (ActionCmponent, Hook) => (props) => {
  const RunHook = { [Hook]: hooks[Hook]() };

  return <ActionCmponent {...RunHook} {...props} />;
};

export function WithHook(ActionCmponent, Hook) {
  if (typeof Hook === "string") {
    return HTP(ActionCmponent, Hook);
  } else if (Hook.length === 1) {
    return HTP(ActionCmponent, Hook[0]);
  } else if (Array.isArray(Hook)) {
    let result;

    for (let i = 0; i < Hook.length; i++) {
      if (i === 0) {
        result = HTP(ActionCmponent, Hook[i]);
      } else {
        result = (props) => {
          const RunHook = { [Hook]: hooks[Hook[i]]() };
          return <result {...{ ...RunHook, ...props }} />;
        };
      }
    }

    return result;
  }
}
