import _ from "lodash";

// without any useState because it use in callback and class components
export default function useSearch(option, single = true) {
  // search props: Phase, Category, Name
  if (
    (_.isUndefined(option?.phase) &&
      _.isUndefined(option?.category) &&
      _.isUndefined(option?.name)) ||
    _.isUndefined(single)
  ) {
    const error = new Error("you should pass a value");
    console.error(error);
    return error;
  }

  let data = null;

  document.querySelectorAll(".Atom").forEach((el) => {
    el.classList.remove("active");
    el.classList.add("hide");
  });

  const query =
    ".Atom" +
    _.keys(option).map(
      (prop) =>
        `[data-${prop}*="${option[prop].replace(
          /-/g,
          " "
        )}"]:not(.${prop}__item)`
    );

  //Get a first one?
  if (single) {
    const el = document.querySelector(query).dataset;
    data = el["name"];
    el.classList.remove("hide");
  } else {
    const els = document.querySelectorAll(query);

    data = Array.from(els).map((el) => {
      el.classList.remove("hide");
      el.classList.add("active");
      return el.dataset.name;
    });
  }

  return data;
}
