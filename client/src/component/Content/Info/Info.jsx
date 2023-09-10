//deps
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { json, Link, useLoaderData, useParams } from "react-router-dom";

//contexts
import { RefreshContext } from "../../Context/Refresh";
import { LoaderContext } from "../../Context/loader";

//hooks
import { useTranslation } from "react-i18next";

//utils
import { BiX } from "react-icons/bi";
import { GiSpeaker } from "react-icons/gi";
import i18n from "../../../translate/i18n";
import { BsWikipedia } from "react-icons/bs";
import { DB, message } from "../../funcs/funcs";

export const InfoLoader = async ({ params, refresh }) => {
  const db = new DB("Single");

  const saved = await db.getSingle(params.atom);

  try {
    if (
      saved === undefined ||
      (!saved?.fa && i18n.language === "fa") ||
      Boolean(refresh)
    ) {
      if (i18n.language === "fa" && !saved) {
        message("translating", "", "info");
      }

      const data = (
        await axios.get(
          `/api/atom/${params.atom}?translate=${i18n.language}&refresh=${refresh}`
        )
      ).data.data;

      db.set([data], false);

      return data;
    } else {
      return saved;
    }
  } catch (error) {
    throw json(error.response.statusText, { status: error.response.status });
  }
};

export default function Info() {
  const { atom } = useParams();
  const [info, setInfo] = useState(useLoaderData());
  const { refresh, setRefresh } = useContext(RefreshContext);
  const loaded = useContext(LoaderContext);
  const { t, i18n } = useTranslation("info");
  const [translate, setTranslate] = useState({ ...info });
  const [lang, setLang] = useState(null);

  let unMount = useRef(true);
  const ReadingBtn = useRef();

  useEffect(() => {
    const ShouldRefresh = async () => {
      loaded.show();

      setRefresh(false);

      const data = await InfoLoader({
        params: { atom },
        refresh: true,
      });

      setInfo(data);

      loaded.hide();
    };

    if (unMount.current) {
      loaded.hide();

      unMount.current = false;

      ReadingBtn.current?.addEventListener("click", () => {
        read(ReadingBtn.current.dataset.word);
      });
    }

    if (lang !== i18n.language) {
      try {
        if (i18n.language === "fa") {
          if (!info.fa) throw new Error("should translate");
          setTranslate({ ...info.fa });
        } else {
          setTranslate({ ...info });
        }
      } catch (e) {
        ShouldRefresh();
      }

      setLang(i18n.language);
    }

    if (refresh) {
      ShouldRefresh();
    }
  }, [
    loaded,
    i18n.language,
    setTranslate,
    info,
    lang,
    setLang,
    refresh,
    setInfo,
    atom,
    setRefresh,
  ]);

  if (Object.keys(info).length > 0) {
    return (
      <section className="info">
        <Link to="/table" className="info__close" title={t("close")}>
          <BiX />
        </Link>

        <h2>
          <button
            title={t("read")}
            ref={ReadingBtn}
            data-word={info.name}
            className="info__read"
          >
            <GiSpeaker />
          </button>
          {translate.name}:
          <span>
            (<sub>{info.number}</sub>
            {info.symbol})
          </span>
        </h2>
        <a
          className="wikipedia"
          title={t("wikipedia")}
          rel="noreferrer"
          target="_blank"
          href={translate.source}
        >
          <BsWikipedia /> {t("wikipedia")}
        </a>
        <h3>
          {t("discovered-by")}: {translate.discovered_by}
        </h3>
        {info.bohr_model_image === null && (
          <>
            <h4 title={t("electron-configuration")}>
              {t("electron-configuration")} : <br />
              {info.electron_configuration}
            </h4>
            <br />
          </>
        )}
        <p>{translate.summary}</p>

        <hr className="info__hr" />

        <section>
          <div className="info__summary">
            <h4 title={t("number")}>
              {t("number")}: {info.number}
            </h4>
            <h4 title={t("atomic-mass")}>
              {t("atomic-mass")}: {info.atomic_mass}
            </h4>
            <h4 title={t("density")}>
              {t("density")}: {info.density}
            </h4>
            <br />
            <h4 title={t("appearance")}>
              {t("appearance")}: {translate.appearance || t("no-appearance")}
            </h4>
            <h4 title={t("category")}>
              {t("category")}: {translate.category}
            </h4>
            <h4 title={t("phase")}>
              {t("phase")}:{translate.phase || t("no-phase")}
            </h4>
            <br />
            <h4 title={t("melt")}>
              {t("melt")}: {info.melt ? info.melt + "K" : "?"}
            </h4>
            <h4 title={t("boil")}>
              {t("boil")}: {info.boil ? info.boil + "K" : "?"}
            </h4>
            <br />
            <h4 title={t("period")}>
              {t("period")}: {t("period")} {info.period}
            </h4>
            <h4 title={t("group")}>
              {t("group")}: {t("group")} {info.group}
            </h4>
          </div>

          <figure className="info__image" title={t("image")}>
            <img src={info.image.url + `?i=${Date.now()}`} alt={translate["image.title"]} />
            <figcaption>
              <em>{translate["image.title"] || translate.image.title}</em>
            </figcaption>
          </figure>

          {info.bohr_model_image !== null && (
            <figure className="info__model" title={t("electron-configuration")}>
              <img
                src={info.bohr_model_image + `?i=${Date.now()}&t=${Math.random()}`}
                alt={`bohr model of ${info.name}`}
              />

              <figcaption>
                {t("electron-configuration")} : <br />
                {info.electron_configuration}
              </figcaption>
            </figure>
          )}
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
