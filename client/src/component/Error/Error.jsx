import { Link } from "react-router-dom";

export default function Error(props) {
  return (
    <section className="error">
      <div className="error__box">
        <h2>ارور {props.code}:</h2>
        <h3>{props.msg}</h3>
        <Link to="/">بازگشت به خانه</Link>
        <br />
        یا
        <br />
        <Link to="/table/find">جست و جو کنید</Link>
      </div>
    </section>
  );
}
