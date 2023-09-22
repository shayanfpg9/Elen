import { RingLoader } from "react-spinners";
import { LoaderContainer } from "./css/loading";

export default function Loader() {
  return (
    <LoaderContainer>
      <RingLoader color="var(--color-text)" loading />
    </LoaderContainer>
  );
}
