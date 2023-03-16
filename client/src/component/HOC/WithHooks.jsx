import * as hooks from "../Hook/hooks";

function GetHook(Hook) {
  let res;

  if (typeof Hook === "string") {
    res = hooks[Hook]();
  } else {
    if (Hook?.HookFunc) {
      res = Hook.HookFunc();
    }

    if (Hook?.callback) {
      res = hooks[Hook](Hook.clallback);
    }

    Hook = Hook.name;
  }

  return { name: Hook, Hook: res };
}

const HTP = (ActionCmponent, Hook) => (props) => {
  const res = GetHook(Hook);
  return <ActionCmponent {...{ ...{ [res.name]: res.Hook }, ...props }} />;
};

export function WithHook(ActionCmponent, Hook) {
  if (typeof Hook === "string") {
    return HTP(ActionCmponent, Hook);
  } else if (Hook.length === 1) {
    return HTP(ActionCmponent, Hook[0]);
  } else if (Array.isArray(Hook)) {
    let Result;

    for (let i = 0; i < Hook.length; i++) {
      if (i === 0) {
        Result = HTP(ActionCmponent, Hook[i]);
      } else {
        let Returned = HTP(Result, Hook[i]);

        Result = (props) => {
          return <Returned {...props} />;
        };
      }
    }

    return Result;
  }
}
