export default class writeEffect {
  effect(el, text, time = 100) {
    text = text.trim();

    let letter = 0;

    el.innerHTML = "";

    const effect = () => {
      if (letter < text.length && !el.hasAttribute("changed")) {
        el.innerHTML = el.innerHTML + text[letter]; //have "+" for rtl langs
        letter++;

        setTimeout(() => {
          effect();
        }, time);
      }
    };

    effect();
  }
}
