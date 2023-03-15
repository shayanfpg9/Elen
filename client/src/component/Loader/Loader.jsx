import styled from "styled-components";
import { RingLoader } from "react-spinners";
import flex from "../Content/CssComponents/Flexbox";

const LoaderContainer = styled.section`
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

export default function Loader({ stop }) {
  document.documentElement.style.overflowY = !stop ? "hidden" : "visible";

  const LoaderProps = {
    color: "var(--color-text)",
    loading: !stop,
    //because the var(--first-fibo) in getComputedStyle get calc() css function we're should do this work:
    size: window?.innerWidth / 13,
    speedMultiplier: 1,
  };

  return (
    <LoaderContainer className={stop ? "hide" : ""}>
      <RingLoader {...LoaderProps} />
    </LoaderContainer>
  );
}
