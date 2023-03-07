import { useState } from "react";
import { useSize } from "./hooks";

export default function useBreakPoint(init = "now") {
  const [breakpoint, setBreackpoint] = useState(""),
    [size, setSize] = useState(init),
    sizes = {
      xxl: useSize("xxl"),
      xl: useSize("xl"),
      md: useSize("md"),
      sm: useSize("sm"),
      xs: useSize("xs"),
    };

  if (typeof init == "string") {
    if (init === "now") {
      setSize(window?.innerWidth);
      window?.addEventListener("resize", () => {
        setSize(window?.innerWidth);
      });
    } else {
      setBreackpoint(init);
    }
  }

  if (size >= sizes.xxl) return "xxl";
  else if (size >= sizes.xl && size < sizes.xxl) setBreackpoint("xl");
  else if (size >= sizes.md && size < sizes.xl) setBreackpoint("md");
  else if (size >= sizes.sm && size < sizes.md) setBreackpoint("sm");
  else setBreackpoint("xs");

  return breakpoint;
}
