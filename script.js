/*
  修改文字速查：
  - 信纸正文：script.js 大概第 9 行开始，改下面 letter 里的内容。
  - 问题和两个选项：index.html 大概第 61-65 行。
  - 点“再想想”后的挽留语：script.js 大概第 162 行。
  - 打字速度：script.js 大概第 133 行，数字越小显示越快。
*/

const letter = `致吴彦娇：

亲爱的蕉蕉，恭喜你终于走过了高考这段漫长又炽热的旅程。从此以后，人生的风会吹向更辽阔的地方，而你也将奔赴属于自己的新篇章。

不知不觉，我们已经在一起一年了。回想最初，我曾不敢对这段感情抱有太多期待，总觉得距离、时间和现实会慢慢冲淡一切。可命运偏偏温柔地证明，真正的喜欢不会轻易被风吹散。原来，有些人一旦走进心里，就会在岁月里慢慢生根，变成我日复一日的牵挂和坚定。

这一年里，我越来越喜欢你，也越来越确定你对我来说有多特别。你知道的，我常常是个不够自信的人，会觉得自己不够好，外貌普通，家境也没有那么优越。可你总是一遍又一遍地告诉我，我很好，值得被喜欢，值得被珍惜。是你让我在自卑的缝隙里，看见了光；也是你让我相信，原来我也可以成为某个人心里很重要的人。

我真的很想和你有以后。想在未来的某一天，不再只是隔着屏幕说想念，而是可以真真切切地站在你面前，牵你的手，看你的眼睛。希望你能考得离我近一点，让我们把想象里的见面变成现实，把漫长的等待变成拥抱。

我也会偷偷幻想更远的未来：等你本科毕业，可以订婚，可以一起规划生活，可以在平凡的日子里并肩走很久很久。也许听起来有些幼稚，有些贪心，但因为那个人是你。

我爱你。不是一时兴起，也不是随口说说，而是想陪你从青春走向更远的明天。愿你此去前程似锦，眼里有星河，脚下有坦途。`;

const app = document.querySelector("#app");
const bgm = document.querySelector("#bgm");
const sky = document.querySelector("#sky");
const openEnvelope = document.querySelector("#openEnvelope");
const envelopeScreen = document.querySelector("#envelopeScreen");
const letterScreen = document.querySelector("#letterScreen");
const promiseScreen = document.querySelector("#promiseScreen");
const finaleScreen = document.querySelector("#finaleScreen");
const letterText = document.querySelector("#letterText");
const letterScroll = document.querySelector("#letterScroll");
const nextButton = document.querySelector("#nextButton");
const yesButton = document.querySelector("#yesButton");
const noButton = document.querySelector("#noButton");
const plea = document.querySelector("#plea");
const canvas = document.querySelector("#fireworksCanvas");
const finaleHearts = document.querySelector("#finaleHearts");

let typeTimer = 0;
let typedIndex = 0;
let noCount = 0;
let fireworksRunning = false;
let hasOpened = false;

const decorativeTones = ["#f283a1", "#ffd9de", "#fff3c8", "#eeb5ca", "#f7a6b6"];

function makeFloaters() {
  const types = ["heart", "heart", "petal", "butterfly"];
  const count = Math.min(34, Math.max(22, Math.floor(window.innerWidth / 12)));
  sky.replaceChildren();

  for (let index = 0; index < count; index += 1) {
    const floater = document.createElement("span");
    const type = types[index % types.length];
    const size = random(11, type === "butterfly" ? 24 : 20);
    floater.className = `floater ${type}`;
    floater.style.setProperty("--x", `${random(-4, 96)}vw`);
    floater.style.setProperty("--size", `${size}px`);
    floater.style.setProperty("--duration", `${random(12, 23)}s`);
    floater.style.setProperty("--delay", `${random(-22, 0)}s`);
    floater.style.setProperty("--sway", `${random(3.8, 7.5)}s`);
    floater.style.setProperty("--drift", `${random(18, 58)}px`);
    floater.style.setProperty("--rotate", `${random(-38, 36)}deg`);
    floater.style.setProperty("--opacity", `${random(0.34, 0.78)}`);
    floater.style.setProperty("--tone", decorativeTones[index % decorativeTones.length]);
    sky.append(floater);
  }
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function showScreen(screen) {
  [envelopeScreen, letterScreen, promiseScreen, finaleScreen].forEach((item) => {
    item.classList.toggle("is-active", item === screen);
  });
}

async function startMusic() {
  try {
    bgm.volume = 0.82;
    bgm.currentTime = Math.max(0, bgm.currentTime);
    await bgm.play();
  } catch {
    app.addEventListener(
      "touchstart",
      () => {
        bgm.play().catch(() => {});
      },
      { once: true, passive: true }
    );
  }
}

function openLetter() {
  if (hasOpened) {
    return;
  }

  hasOpened = true;
  startMusic();
  openEnvelope.classList.add("is-opening");

  window.setTimeout(() => {
    showScreen(letterScreen);
    startTypewriter();
  }, 700);
}

function startTypewriter() {
  window.clearTimeout(typeTimer);
  typedIndex = 0;
  letterText.textContent = "";
  letterText.classList.remove("is-finished");
  nextButton.classList.remove("is-visible");
  letterScroll.scrollTop = 0;

  const tick = () => {
    const char = letter[typedIndex];
    letterText.textContent += char;
    typedIndex += 1;

    const scrollTarget = Math.max(0, letterScroll.scrollHeight - letterScroll.clientHeight);
    letterScroll.scrollTo({
      top: scrollTarget,
      behavior: typedIndex % 18 === 0 ? "smooth" : "auto",
    });

    if (typedIndex < letter.length) {
      const nextChar = letter[typedIndex] || "";
      const delay = nextChar === "\n" ? 280 : /[。；：，、！？]/.test(nextChar) ? 165 : 82;
      typeTimer = window.setTimeout(tick, delay);
      return;
    }

    letterText.classList.add("is-finished");
    window.setTimeout(() => {
      letterScroll.scrollTo({ top: letterScroll.scrollHeight, behavior: "smooth" });
      nextButton.classList.add("is-visible");
    }, 420);
  };

  typeTimer = window.setTimeout(tick, 460);
}

function goToPromise() {
  noCount = 0;
  plea.textContent = "";
  noButton.classList.remove("is-hidden");
  promiseScreen.style.setProperty("--yes-flex", "1");
  promiseScreen.style.setProperty("--no-flex", "1");
  promiseScreen.style.setProperty("--yes-size", "4.7vw");
  promiseScreen.style.setProperty("--no-size", "4.2vw");
  promiseScreen.style.setProperty("--no-opacity", "1");
  showScreen(promiseScreen);
}

function askAgain() {
  noCount += 1;
  plea.textContent = "不愿意吗？求求你了";

  if (noCount >= 5) {
    noButton.classList.add("is-hidden");
    promiseScreen.style.setProperty("--yes-flex", "1");
    promiseScreen.style.setProperty("--yes-size", "7.2vw");
    promiseScreen.style.setProperty("--no-flex", "0");
    promiseScreen.style.setProperty("--no-opacity", "0");
    return;
  }

  const yesFlex = Math.min(5.8, 1 + noCount * 0.92);
  const noFlex = Math.max(0.24, 1 - noCount * 0.16);
  const yesSize = Math.min(7.5, 4.7 + noCount * 0.46);
  const noSize = Math.max(2.4, 4.2 - noCount * 0.34);
  const noOpacity = Math.max(0.42, 1 - noCount * 0.08);

  promiseScreen.style.setProperty("--yes-flex", String(yesFlex));
  promiseScreen.style.setProperty("--no-flex", String(noFlex));
  promiseScreen.style.setProperty("--yes-size", `${yesSize}vw`);
  promiseScreen.style.setProperty("--no-size", `${noSize}vw`);
  promiseScreen.style.setProperty("--no-opacity", String(noOpacity));
  noButton.animate(
    [
      { transform: "translateX(0) scale(1)" },
      { transform: "translateX(-6px) scale(0.96)" },
      { transform: "translateX(6px) scale(0.96)" },
      { transform: "translateX(0) scale(1)" },
    ],
    { duration: 310, easing: "ease-out" }
  );
}

function startFinale() {
  showScreen(finaleScreen);
  makeHeartBurst();
  runFireworks();
}

function makeHeartBurst() {
  finaleHearts.replaceChildren();
  const colors = ["#f05b88", "#ff9fba", "#ffd3a2", "#ffffff", "#d33f66"];
  for (let index = 0; index < 34; index += 1) {
    const heart = document.createElement("span");
    const angle = (Math.PI * 2 * index) / 34 + random(-0.18, 0.18);
    const distance = random(96, Math.min(window.innerWidth, window.innerHeight) * 0.52);
    heart.className = "burst-heart";
    heart.style.setProperty("--s", `${random(8, 19)}px`);
    heart.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    heart.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    heart.style.setProperty("--r", `${random(-110, 120)}deg`);
    heart.style.setProperty("--d", `${random(0, 0.28)}s`);
    heart.style.setProperty("--c", colors[index % colors.length]);
    finaleHearts.append(heart);
  }
}

function runFireworks() {
  const context = canvas.getContext("2d");
  const particles = [];
  const confetti = [];
  const colors = ["#e94573", "#ffb1c6", "#ffe08b", "#ffffff", "#b8395b", "#f489a3"];
  fireworksRunning = true;

  function resize() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * pixelRatio);
    canvas.height = Math.floor(window.innerHeight * pixelRatio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function burst(x, y) {
    for (let index = 0; index < 44; index += 1) {
      const angle = random(0, Math.PI * 2);
      const speed = random(1.8, 5.4);
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: random(44, 76),
        color: colors[Math.floor(random(0, colors.length))],
        size: random(1.3, 3.2),
      });
    }
  }

  function tossConfetti() {
    for (let index = 0; index < 28; index += 1) {
      confetti.push({
        x: random(0, window.innerWidth),
        y: random(-60, -8),
        vx: random(-0.7, 0.7),
        vy: random(1.8, 4.3),
        spin: random(0, Math.PI),
        turn: random(-0.18, 0.18),
        color: colors[Math.floor(random(0, colors.length))],
        w: random(5, 9),
        h: random(9, 16),
        life: random(120, 190),
      });
    }
  }

  let frame = 0;
  resize();
  burst(window.innerWidth * 0.5, window.innerHeight * 0.36);
  tossConfetti();
  window.addEventListener("resize", resize, { passive: true });

  function draw() {
    if (!fireworksRunning || !finaleScreen.classList.contains("is-active")) {
      return;
    }

    frame += 1;
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (frame % 38 === 0) {
      burst(random(window.innerWidth * 0.16, window.innerWidth * 0.84), random(86, window.innerHeight * 0.48));
    }

    if (frame % 58 === 0) {
      tossConfetti();
    }

    for (let index = particles.length - 1; index >= 0; index -= 1) {
      const particle = particles[index];
      particle.life -= 1;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.032;
      particle.vx *= 0.988;
      const alpha = Math.max(0, particle.life / 76);
      context.globalAlpha = alpha;
      context.fillStyle = particle.color;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
      if (particle.life <= 0) {
        particles.splice(index, 1);
      }
    }

    for (let index = confetti.length - 1; index >= 0; index -= 1) {
      const bit = confetti[index];
      bit.life -= 1;
      bit.x += bit.vx + Math.sin(frame * 0.04 + bit.spin) * 0.34;
      bit.y += bit.vy;
      bit.spin += bit.turn;
      context.globalAlpha = Math.max(0, Math.min(1, bit.life / 110));
      context.fillStyle = bit.color;
      context.save();
      context.translate(bit.x, bit.y);
      context.rotate(bit.spin);
      context.fillRect(-bit.w / 2, -bit.h / 2, bit.w, bit.h);
      context.restore();

      if (bit.life <= 0 || bit.y > window.innerHeight + 24) {
        confetti.splice(index, 1);
      }
    }

    context.globalAlpha = 1;
    window.requestAnimationFrame(draw);
  }

  window.requestAnimationFrame(draw);
}

makeFloaters();
bgm.load();

envelopeScreen.addEventListener("pointerdown", openLetter);
envelopeScreen.addEventListener("click", openLetter);
nextButton.addEventListener("click", goToPromise);
noButton.addEventListener("click", askAgain);
yesButton.addEventListener("click", startFinale);
window.addEventListener("resize", makeFloaters, { passive: true });
