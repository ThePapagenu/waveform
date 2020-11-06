class Waveform {
  constructor(name, url) {
    this.name = name;
    this.url = url;
  }
  r(e) {
    const hw = document.createElement("div");
    hw.style.display = "flex";
    hw.style.width = "100%";
    hw.style.maxWidth = "165px";
    hw.style.marginTop = "7px";
    hw.style.marginLeft = "20px";
    hw.style.padding = "5px";
    hw.style.flexDirection = "column";
    e.appendChild(hw);
    const wrap = document.createElement("div");
    wrap.style.display = "flex";
    wrap.style.flexDirection = "row-reverse";
    wrap.style.width = "165px";
    wrap.style.height = "24px";
    hw.appendChild(wrap);
    const d = document.createElement("div");
    d.style.maxWidth = `165px`;
    d.style.width = "100%";
    d.style.textAlign = "center";
    d.style.fontFamily = "Arimo,sans-serif";
    d.style.marginTop = "5px";
    d.style.color = "#333232";
    wrap.appendChild(d);
    const wavesurfer = WaveSurfer.create({
      container: d,
      waveColor: "#333232",
      progressColor: "#6a6a6a",
      height: 24,
      normalize: true,
      responsive: true,
      backend: "MediaElement",
      hideScrollbar: true,
      cursorWidth: 0
    });
    const t = document.createElement("p");
    t.style.width = "100%";
    t.style.display = "inline";
    t.style.textAlign = "center";
    t.innerHTML = this.name;
    t.style.marginTop = "25px";
    t.style.fontFamily = "Arimo, sans-serif";
    t.style.fontSize = "14px";
    t.style.fontWeight = "bold";
    t.style.color = "#161616";
    const b = document.createElement("p");
    b.style.width = "100%";
    b.style.cursor = 'pointer'
    b.style.maxWidth = "24px";
    b.style.display = "inline";
    b.style.marginRight = "5px";
    b.style.marginTop = "5px";
    b.classList.add("material-icons");
    b.innerHTML = "play_arrow";
    wavesurfer.on("ready", () => {
      wrap.appendChild(b);
      hw.appendChild(t);
    });
    return {
      btn: b,
      worker: wavesurfer
    };
  }
  h(e) {
    const worker = this.r(e);
    worker.worker.load(this.url);
    return worker;
  }
}
const init = (element,names, urls) => {
  const icons = document.createElement("link");
  icons.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
  icons.rel = "stylesheet";
  document.head.appendChild(icons);
  const ws = document.createElement("script");
  ws.src = "https://unpkg.com/wavesurfer.js";
  document.body.appendChild(ws);
  ws.onload = function() {
    renderDeck(element,names, urls);
  };
};
const renderDeck = (element,names, urls) => {
  let choosen = {
    button: null,
    handler: null
  };
  const deckWrapper = document.querySelector(`.${element}`)
  for (let i = 0; i < names.length; i++) {
    let wave = new Waveform(names[i], urls[i]);
    let waveCtrl = wave.h(deckWrapper);
    waveCtrl.worker.on("ready", function() {
      waveCtrl.btn.addEventListener("click", function() {
        if (waveCtrl.btn.innerHTML === "play_arrow") {
          console.log(waveCtrl.btn.innerHTML);
          if (choosen.handler === null) {
            choosen.handler = waveCtrl.worker;
            choosen.button = waveCtrl.btn;
            choosen.handler.setProgressColor("#6a6a6a");
            if (choosen.button.innerHTML === "play_arrow") {
              choosen.handler.play();
              choosen.button.innerHTML = "pause";
            } else if (choosen.button.innerHTML === "pause") {
              choosen.handler.pause();
              choosen.button.innerHTML = "play_arrow";
            }
          } else {
            choosen.handler.pause();
            choosen.button.innerHTML = "play_arrow";
            choosen.handler = waveCtrl.worker;
            choosen.button = waveCtrl.btn;
            choosen.handler.setProgressColor("#6a6a6a");
            if (choosen.button.innerHTML === "play_arrow") {
              choosen.handler.play();
              choosen.button.innerHTML = "pause";
            } else if (choosen.button.innerHTML === "pause") {
              choosen.handler.pause();
              choosen.button.innerHTML = "play_arrow";
            }
          }
        }else if(waveCtrl.btn.innerHTML === "pause" && choosen.handler === waveCtrl.worker){
            choosen.handler.pause();
            choosen.button.innerHTML = 'play_arrow'
            choosen.handler = null
            choosen.button = null
        }
        choosen.handler.backend.on("audioprocess", function(time) {
          if (time >= choosen.handler.backend.getDuration()) {
            choosen.button.innerHTML = "play_arrow";
            choosen.handler.setProgressColor("#333232");
          }
        });
      });
    });
  }
};
