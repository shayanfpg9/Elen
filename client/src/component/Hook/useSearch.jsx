import _ from "lodash";
import { useState } from "react";

export default function useSearch() {
  //this hook just search with the attr of the elements on the page
  const [data, setData] = useState(null);

  const ChangeStatus = (option, single = true) => {
    document.querySelectorAll(".Atom").forEach((el) => {
      el.classList.remove("active");
      el.classList.add("hide");
    });

    const query =
      ".Atom" +
      _.keys(option).map(
        (prop) =>
          `[data-${prop}*="${option[prop].replace( // match in any where
            /-/g,
            " "
          )}"]:not(.${prop}__item)`
      );

    //Get a first one?
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

  return [data, ChangeStatus];
}
