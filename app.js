(() => {
  const cfg = window.DARIA_LOVE;
  const $ = (id) => document.getElementById(id);

  const gateName = $("gateName");
  const heroName = $("heroName");
  const heroLine = $("heroLine");
  const heroSub = $("heroSub");
  const letterTitle = $("letterTitle");
  const letterBody = $("letterBody");
  const reasonsTitle = $("reasonsTitle");
  const reasonsGrid = $("reasonsGrid");
  const starsTitle = $("starsTitle");
  const starsSky = $("starsSky");
  const galleryTitle = $("galleryTitle");
  const galleryHint = $("galleryHint");
  const galleryGrid = $("galleryGrid");
  const vowsTitle = $("vowsTitle");
  const vowsList = $("vowsList");
  const finaleTitle = $("finaleTitle");
  const finaleLine = $("finaleLine");
  const finaleSub = $("finaleSub");
  const musicTitle = $("musicTitle");

  gateName.textContent = cfg.herName;
  heroName.textContent = cfg.herName;
  heroLine.textContent = cfg.heroLine;
  heroSub.textContent = cfg.heroSub;
  letterTitle.textContent = cfg.letterTitle;
  reasonsTitle.textContent = cfg.reasonsTitle;
  starsTitle.textContent = cfg.starsTitle;
  galleryTitle.textContent = cfg.galleryTitle;
  galleryHint.textContent = cfg.galleryHint;
  vowsTitle.textContent = cfg.vowsTitle;
  finaleTitle.textContent = cfg.finaleTitle;
  finaleLine.textContent = cfg.finaleLine;
  finaleSub.textContent = cfg.finaleSub;
  musicTitle.textContent = cfg.musicTitle;

  cfg.letter.forEach((para) => {
    const p = document.createElement("p");
    p.textContent = para;
    letterBody.appendChild(p);
  });

  cfg.reasons.forEach((item) => {
    const el = document.createElement("article");
    el.className = "reason";
    el.innerHTML = `<h3>${item.title}</h3><p>${item.text}</p>`;
    reasonsGrid.appendChild(el);
  });

  let litStars = 0;
  cfg.stars.forEach((word, i) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "star-word";
    el.textContent = word;
    el.style.animationDelay = `${i * 0.22}s`;
    el.addEventListener("click", () => {
      if (el.classList.contains("is-lit")) return;
      el.classList.add("is-lit");
      litStars += 1;
      if (litStars === cfg.stars.length) {
        const note = document.createElement("p");
        note.className = "gallery__hint";
        note.textContent = "Всё созвездие зажглось. И каждое слово — про тебя.";
        starsSky.after(note);
      }
    });
    starsSky.appendChild(el);
  });

  cfg.vows.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    vowsList.appendChild(li);
  });

  const lightbox = $("lightbox");
  const lightboxImg = $("lightboxImg");
  const lightboxCap = $("lightboxCap");

  const openLightbox = (src, caption) => {
    lightboxImg.src = src;
    lightboxImg.alt = caption;
    lightboxCap.textContent = caption;
    lightbox.hidden = false;
  };

  const heroPortrait = $("heroPortrait");
  const mirrorPortrait = $("mirrorPortrait");
  heroPortrait.src = cfg.portrait;
  heroPortrait.alt = cfg.herName;
  mirrorPortrait.src = cfg.portrait;
  mirrorPortrait.alt = cfg.herName;
  $("heroPortraitBtn").addEventListener("click", () => openLightbox(cfg.portrait, cfg.herName));

  $("mirrorTitle").textContent = cfg.mirrorTitle;
  $("mirrorSpell").textContent = cfg.mirrorSpell;

  const mirrorGlass = $("mirrorGlass");
  const mirrorQs = $("mirrorQs");
  const mirrorChoices = $("mirrorChoices");
  const mirrorVerdict = $("mirrorVerdict");
  const mirrorCrown = $("mirrorCrown");
  const mirrorWhisper = $("mirrorWhisper");
  const won = new Set();
  let active = -1;

  const shuffle = (list) => list.slice().sort(() => Math.random() - 0.5);

  const ask = (index) => {
    active = index;
    [...mirrorQs.children].forEach((btn, i) => btn.classList.toggle("is-on", i === index));
    mirrorChoices.hidden = false;
    mirrorChoices.innerHTML = "";
    mirrorWhisper.textContent = cfg.mirrorQuestions[index].ask;
    const options = shuffle([cfg.herName, ...cfg.mirrorWrong]);
    options.forEach((name) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = name;
      btn.addEventListener("click", () => answer(index, name, btn));
      mirrorChoices.appendChild(btn);
    });
  };

  const answer = (index, name) => {
    if (name !== cfg.herName) {
      mirrorGlass.classList.remove("is-shake");
      void mirrorGlass.offsetWidth;
      mirrorGlass.classList.add("is-shake");
      mirrorVerdict.textContent = cfg.mirrorNope[Math.floor(Math.random() * cfg.mirrorNope.length)];
      return;
    }
    won.add(index);
    mirrorQs.children[index].classList.add("is-won");
    mirrorVerdict.textContent = cfg.mirrorQuestions[index].answer;
    mirrorChoices.hidden = true;
    const left = cfg.mirrorQuestions.length - won.size;
    if (left === 0) {
      mirrorPortrait.style.filter = "";
      mirrorGlass.classList.add("is-clear");
      mirrorCrown.hidden = false;
      mirrorCrown.textContent = cfg.mirrorCrown;
      mirrorWhisper.textContent = cfg.herName;
      return;
    }
    mirrorGlass.style.setProperty("--clear", String(won.size));
    mirrorPortrait.style.filter = `blur(${Math.max(0, 10 - won.size * 2)}px) brightness(${0.45 + won.size * 0.1})`;
    const next = cfg.mirrorQuestions.findIndex((_, i) => !won.has(i));
    if (next >= 0) ask(next);
  };

  cfg.mirrorQuestions.forEach((q, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = q.ask;
    btn.addEventListener("click", () => {
      if (!won.has(i)) ask(i);
    });
    mirrorQs.appendChild(btn);
  });

  mirrorGlass.addEventListener("click", () => {
    const next = cfg.mirrorQuestions.findIndex((_, i) => !won.has(i));
    if (next >= 0) ask(next);
  });

  const paintGallery = (photos) => {
    galleryGrid.innerHTML = "";
    photos.forEach((photo) => {
      const fig = document.createElement("figure");
      fig.className = "frame is-empty";
      const caption = document.createElement("p");
      caption.textContent = photo.caption;
      fig.appendChild(caption);

      const img = new Image();
      img.alt = photo.caption;
      img.onload = () => {
        fig.classList.remove("is-empty");
        fig.appendChild(img);
        fig.onclick = () => openLightbox(img.src, photo.caption);
      };
      img.src = photo.src;
      galleryGrid.appendChild(fig);
    });
  };

  paintGallery(cfg.photos);

  $("lightboxClose").onclick = () => {
    lightbox.hidden = true;
    lightboxImg.src = "";
  };
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) $("lightboxClose").click();
  });

  const canvas = $("petals");
  const ctx = canvas.getContext("2d");
  const petals = [];
  const resize = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  };
  resize();
  addEventListener("resize", resize);

  for (let i = 0; i < 38; i += 1) {
    petals.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: 4 + Math.random() * 7,
      s: 0.4 + Math.random() * 0.9,
      a: Math.random() * Math.PI * 2,
      w: 0.008 + Math.random() * 0.02,
    });
  }

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach((p) => {
      p.y += p.s;
      p.x += Math.sin(p.a) * 0.6;
      p.a += p.w;
      if (p.y > canvas.height + 12) {
        p.y = -12;
        p.x = Math.random() * canvas.width;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      ctx.fillStyle = "rgba(212, 120, 138, 0.55)";
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.62, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  };
  draw();

  const toggleBtn = $("musicToggle");
  const stateEl = $("musicState");
  const setMusicUi = (on) => {
    toggleBtn.classList.toggle("is-off", !on);
    stateEl.textContent = on ? "играет для тебя" : "нажми, чтобы снова зазвучало";
  };

  $("enterBtn").addEventListener("click", async () => {
    $("gate").classList.add("is-gone");
    $("story").hidden = false;
    document.body.classList.add("is-open");
    await window.romanticMusic.start();
    setMusicUi(true);
  });

  toggleBtn.addEventListener("click", async () => {
    if (window.romanticMusic.playing) {
      await window.romanticMusic.toggle();
      setMusicUi(false);
    } else {
      await window.romanticMusic.start();
      setMusicUi(true);
    }
  });

  $("volume").addEventListener("input", (e) => {
    window.romanticMusic.setVolume(Number(e.target.value));
  });
})();
