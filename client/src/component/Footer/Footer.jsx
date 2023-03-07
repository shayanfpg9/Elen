import * as bs from "react-icons/bs";

export default function Footer() {
  return (
    <footer className="footer">
      <bs.BsCCircle /> copyright&nbsp;
      {new Date().getFullYear()} -
      <a className="link--special" href="https://github.com/Shayanfpg9">
        Shayanfpg9
      </a>
      <bs.BsHeartFill className="footer__icon--heart" />
      <bs.BsCupHotFill className="footer__icon--cup" />
    </footer>
  );
}
