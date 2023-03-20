import { useState } from "react";
import { getSize } from "../funcs/funcs";

export default function useBreakPoint(init = "now") {
  const [breakpoint, setBreackpoint] = useState(""),
    [size, setSize] = useState(init),
    sizes = {
      xxl: getSize("xxl"),
      xl: getSize("xl"),
      md: getSize("md"),
      sm: getSize("sm"),
      xs: getSize("xs"),
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

  //don't find the exact value -> find a range
  if (size >= sizes.xxl) return "xxl";
  else if (size >= sizes.xl && size < sizes.xxl) setBreackpoint("xl");
  else if (size >= sizes.md && size < sizes.xl) setBreackpoint("md");
  else if (size >= sizes.sm && size < sizes.md) setBreackpoint("sm");
  else setBreackpoint("xs");

  return breakpoint;
}
