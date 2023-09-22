"use client";

import { styled } from "styled-components";
import flex from "../../components/css/Flexbox";

export const LoaderContainer = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 12;
  backdrop-filter: blur(10px);
  background-color: rgba(var(--color-fg-rgb), 0.7);
  ${flex};
  opacity: 1;
  transition: 0.5s all var(--animation);

  &.hide {
    opacity: 0;
  }
`;
