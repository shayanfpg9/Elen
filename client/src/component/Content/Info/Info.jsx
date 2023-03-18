import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BiX } from "react-icons/bi";
import _ from "lodash";
import { GiSpeaker } from "react-icons/gi";
import { RefreshContext } from "../../Context/Refresh";
import { LoadedContext } from "../../Context/Loaded";
import Error from "../../Error/Error";
import { DB, equal } from "../../funcs/funcs";
import { useTranslation } from "react-i18next";

export default function Info(props) {
  const { atom } = useParams();
  const [info, setInfo] = useState({});
  const { refresh, setRefresh } = useContext(RefreshContext);
  const loaded = useContext(LoadedContext);
  const { t, i18n } = useTranslation("info");
  const [translate, setTranslate] = useState(info);

  let unMount = useRef(true);
  const ReadingBtn = useRef();

  useEffect(() => {
    if (unMount.current || refresh) {
      const db = new DB("Single");

      loaded.show();

      unMount.current = false;

      db.getSingle(atom, (res) => {
        if (!equal(res, []) || refresh) {
          axios
            .get(`/api/atom/${atom}?translate=fa&refresh=${refresh}`)
            .then(({ data }) => {
              db.set([data], false);

              setInfo(data);
            })
            .finally(() => {
              loaded.hide();
            });

          setRefresh(false);
        } else {
          setInfo(res);
        }
      });
    }

    if (i18n.language === "fa") {
      setTranslate(info.fa);
    } else {
      setTranslate(info);
    }

    ReadingBtn.current?.addEventListener("click", () => {
      read(ReadingBtn.current.dataset.word);
    });
  }, [atom, loaded, setRefresh, refresh, i18n.language, setTranslate, info]);

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
          {translate.name}:
          <span>
            (<sub>{info.number}</sub>
            {info.symbol})
          </span>
        </h2>
        <a rel="noreferrer" target="_blank" href={translate.source}>
          {t("wikipedia")}
        </a>
        <h3>
          {t("discovered-by")}: {translate.discovered_by}
        </h3>
        <p>{translate.summary}</p>

        <hr className="info__hr" />

        <section>
          <div className="info__summary">
            <h4>
              {t("number")}: {info.number}
            </h4>
            <h4>
              {t("atomic-mass")} {info.atomic_mass}
            </h4>
            <h4>
              {t("density")}: {info.density}
            </h4>
            <br />
            <h4>
              {t("appearance")}: {translate.appearance || t("no-appearance")}
            </h4>
            <h4>
              {t("category")}: {translate.category}
            </h4>
            <h4>
              {t("phase")}:{translate.phase || t("no-phase")}
            </h4>
            <br />
            <h4>
              {t("melt")}: {info.melt ? info.melt + "K" : "?"}
            </h4>
            <h4>
              {t("boil")}: {info.boil ? info.boil + "K" : "?"}
            </h4>
            <br />
            <h4>
              {t("period")}: {t("period")} {info.period}
            </h4>
            <h4>
              {t("group")}: {t("group")} {info.group}
            </h4>
          </div>

          <figure className="info__image">
            <img src={info.image.url} alt={translate["image.title"]} />
            <figcaption>
              <em>{translate["image.title"]}</em>
            </figcaption>
          </figure>

          <figure className="info__model">
            <img
              src={info.bohr_model_image}
              alt={`bohr model of ${info.name}`}
            />
            <figcaption>
              {t("electron-configuration")} : <br />
              {info.electron_configuration}
            </figcaption>
          </figure>
        </section>
      </section>
    );
  } else {
    return <Error code="404" msg="عنصر مورد نظر یافت نشد" />;
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
