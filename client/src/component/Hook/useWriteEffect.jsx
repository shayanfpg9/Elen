import { useEffect, useRef, useState } from "react";

export default function useWriteEffect(text, time = 100) {
  text = text.trim();

  let letter = 0;

  let toNow = "";
  const [res, setChar] = useState("");

  const effect = () => {
    if (letter < text.length) {
      toNow = toNow + text[letter]; //have "+" for rtl langs
      setChar(toNow); //useState have a problem to do this work
      letter++;

      setTimeout(() => {
        effect();
      }, time);
    }
  };

  const Mount = useRef(false);

  useEffect(() => {
    if (!Mount.current) {
      Mount.current = true;
      effect();
    }
  });

  return {
    text: res,
    end: text.length - res.length || true,
  };
}
