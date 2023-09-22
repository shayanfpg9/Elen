"use client";

import { useEffect, useRef, useState } from "react";
import { keyframes, styled } from "styled-components";

const WriterAnimation = keyframes`
    0% {
        opacity: 1; 
    }

    50% {
        opacity: 0; 
    }

    100% {
        opacity: 1; 
    }
`;

const Component = styled.h2`
  &::after {
    content: "";
    background-color: var(--color-text);
    position: absolute;
    width: 4px;
    margin: 0 2px;
    height: 75%;
    animation: ${WriterAnimation} 0.5s linear infinite;
    display: ${(props) => (!props.$end ? "inline-block" : "none")};
  }
`;

function Writer({ text, as, timer }) {
  if (timer == undefined) {
    timer = 100;
  }

  const el = useRef(null);
  const [inner, setText] = useState("");

  let letter = 0;

  const effect = () => {
    if (letter < text.length && !el.current.hasAttribute("changed")) {
      setText(text.slice(0, ++letter)); //have "+" for rtl langs

      setTimeout(() => {
        effect();
      }, timer);
    }
  };

  useEffect(() => {
    effect();
  }, []);

  return (
    <Component as={as} ref={el} $end={inner.length === text.length}>
      {inner}
    </Component>
  );
}

export default Writer;
