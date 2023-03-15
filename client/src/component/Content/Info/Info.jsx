import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BiX } from "react-icons/bi";
import _ from "lodash";
import { GiSpeaker } from "react-icons/gi";
import { RefreshContext } from "../../Context/Refresh";

export default function Info(props) {
  const { atom } = useParams();
  const [info, setInfo] = useState({});
  const [refresh, setRefresh] = useContext(RefreshContext);

  let unMount = useRef(true);
  const ReadingBtn = useRef();

  useEffect(() => {
    if (unMount.current || refresh) {
      props.loaded.show();

      unMount.current = false;
      axios
        .get(`/api/atom/${atom}?translate=fa&refresh=${refresh}`)
        .then((res) => {
          setInfo(res.data);

          props.loaded.hide();

          setTimeout(() => {
            props.loaded.remove();
          }, 600);
        });

      setRefresh(false);
    }

    ReadingBtn.current?.addEventListener("click", () => {
      read(ReadingBtn.current.dataset.word);
    });
  }, [atom, props.loaded, setRefresh, refresh]);

  if (_.keys(info).length > 0) {
    return (
      <section className="info">
        <Link to="/table" className="info__close">
          <BiX />
        </Link>

        <h2>
          <button ref={ReadingBtn} data-word={info.name} className="info__read">
            <GiSpeaker />
          </button>
          {info.fa.name}:
          <span>
            (<sub>{info.number}</sub>
            {info.symbol})
          </span>
        </h2>
        <a rel="noreferrer" target="_blank" href={info.fa.source}>
          در ویکی پدیا
        </a>
        <h3>کاشف / زمان کشف: {info.fa.discovered_by}</h3>
        <p>{info.fa.summary}</p>

        <hr className="info__hr" />

        <section>
          <div className="info__summary">
            <h4>عدد اتمی: {info.number}</h4>
            <h4>جرم: {info.atomic_mass}</h4>
            <h4>چگالی: {info.density}</h4>
            <br />
            <h4>ظاهر: {info.fa.appearance || "ظاهر خاصی ندارد"}</h4>
            <h4>دسته: {info.fa.category}</h4>
            <h4>
              فاز در دما و فشار استاندارد (STP):{" "}
              {info.fa.phase || "بدون حالت پایدار"}
            </h4>
            <br />
            <h4>دمای ذوب: {info.melt ? info.melt + "K" : "?"}</h4>
            <h4>دمای جوش: {info.boil ? info.boil + "K" : "?"}</h4>
            <br />
            <h4>دوره: دوره {info.period}</h4>
            <h4>گروه: گروه {info.group}</h4>
          </div>

          <figure className="info__image">
            <img src={info.image.url} alt={info.fa["image.title"]} />
            <figcaption>
              <em>{info.fa["image.title"]}</em>
            </figcaption>
          </figure>

          <figure className="info__model">
            <img
              src={info.bohr_model_image}
              alt={`bohr model of ${info.name}`}
            />
            <figcaption>
              طرز قرار گیری الکترون ها: <br />
              {info.electron_configuration}
            </figcaption>
          </figure>
        </section>
      </section>
    );
  }
}

function read(text) {
  const speech = new SpeechSynthesisUtterance();
  speech.lang = "en-US";
  speech.volume = 1;
  speech.rate = 0.7;
  speech.pitch = 1;
  speech.text = text;

  window.speechSynthesis.onvoiceschanged = () => {
    speech.voice = window.speechSynthesis.getVoices()[0];
  };

  if (!speechSynthesis.speaking) window.speechSynthesis.speak(speech);
}
