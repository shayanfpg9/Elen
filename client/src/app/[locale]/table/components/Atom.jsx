import { mix } from "chroma-js";
import { colors } from "./css/Colors";
import { AtomCel } from "./css/Atom";

export default function Atom(props) {
  let PropCat = props.category.replace("post-transition", "post_transition");

  const category = [];
  [...Object.keys(colors), "metal"].forEach((cat) => {
    if (PropCat.includes(cat)) {
      PropCat = PropCat.replace(cat, "");
      category.push(cat);
    }
  });

  const color = mix(
    category[0] === "unknown"
      ? colors[category[1].replace("-", "")]
      : colors[category[0].replace("-", "")],
    colors.unknown,
    category.includes("unknown") ? 0.75 : 0
  );

  return (
    <AtomCel
      href={`/atom/${props.name}`}
      data-name={props.name}
      $number={props.number}
      $position={props.position}
      $phase={props.phase}
      $category={category}
      color={color.hex()}
      $darkenColor={[
        color.darken(0.2).hex(),
        color.darken(0.7).hex(),
        color.darken(0.5).hex(),
      ]}
      title={props.name}
      aria-label={props.name}
      className={`Atom ${props.className || ""}`}
    >
      <span>
        <sub>{props.number}</sub>
        {props.symbol}
      </span>
    </AtomCel>
  );
}
