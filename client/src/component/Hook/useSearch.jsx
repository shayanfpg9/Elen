import { useState } from "react";

export default function useSearch() {
  //this hook just search with the attr of the elements on the page
  const [data, setData] = useState(null);

  const search = (option, single = true) => {
    document.querySelectorAll(".Atom").forEach((el) => {
      el.classList.remove("active");
      el.classList.add("hide");
    });

    let query =
      ".Atom" +
      Object.keys(option).map(
        (prop) =>
          `[data-${prop}*="${option[prop].replace(
            // match in any where
            /-/g,
            " "
          )}"]:not(.${prop}__item)`
      );

    Object.keys(option).map((prop) => {
      if (option[prop] === "transition") {
        query += `:not([data-${prop}*="post_transition"])`;
      }
    });

    if (single) {
      const el = document.querySelector(query).dataset;
      setData(el["name"]);
      el.classList.remove("hide");
    } else {
      const els = document.querySelectorAll(query); // all of the elements with this query

      setData(
        Array.from(els).map((el) => {
          el.classList.remove("hide");
          el.classList.add("active");
          return el.dataset.name;
        })
      );
    }
  };

  return [data, search];
}
