"use client";

import { ThemeContext } from "@/context/theme";
import { useEffect, useRef, useState } from "react";
import * as bs from "react-icons/bs";
import { ThemeProvider } from "styled-components";

function Provider({ children, DefaulTheme }) {
  if (typeof window === "undefined") {
    return <>{children}</>;
  }

  const mount = useRef(false);

  // Theme provider:
  const localStorage = window.localStorage;
  const [themeIcon, setIcon] = useState();
  const theme = useRef(localStorage.getItem("theme"));
  const BehindTheme = useRef(localStorage.getItem("theme"));

  const SetTheme = (newTheme, automate = false) => {
    let MainThemeName = newTheme;

    if (newTheme === "system") {
      if (window.matchMedia) {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          MainThemeName = "dark";
        } else {
          MainThemeName = "light";
        }
      } else {
        MainThemeName = DefaulTheme;
      }
    }

    if (
      !automate ||
      (BehindTheme.current === "system" && MainThemeName !== theme.current)
    ) {
      document.body.classList.remove("dark", "light");
      document.body.classList.add(MainThemeName);

      theme.current = MainThemeName;
      BehindTheme.current = newTheme;

      localStorage.setItem("theme", newTheme);

      if (BehindTheme.current === "system") {
        setIcon(() => <bs.BsFillDropletFill />);
      } else if (BehindTheme.current === "dark") {
        setIcon(() => <bs.BsFillMoonStarsFill />);
      } else if (BehindTheme.current === "light") {
        setIcon(() => <bs.BsFillSunFill />);
      }

      if (mount.current) {
        console.log(
          `%c ${theme.current} `,
          `font-size: 0.8rem; text-transform: capitalize; font-family:helvetica; font-weight:bold; background-color: ${
            theme.current === "light" ? "white" : "navy"
          }; color:${theme.current !== "light" ? "white" : "navy"}`,
          "\nBehind theme: " + BehindTheme.current,
          "\nAppearance theme: " + theme.current
        );
      }
    }
  };

  useEffect(() => {
    if (!mount.current) {
      SetTheme(localStorage.getItem("theme"));

      mount.current = true;
    }
  });

  if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "system");
  }

  const themeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  themeQuery.addEventListener("change", () => {
    if (BehindTheme.current === "system") {
      SetTheme("system", true);
    }
  });

  return (
    <ThemeContext.Provider
      value={{
        behind: BehindTheme.current,
        theme: theme.current,
        Icon: themeIcon,
        setTheme: SetTheme,
      }}
    >
      <ThemeProvider theme={{ name: theme.current }}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default Provider;
