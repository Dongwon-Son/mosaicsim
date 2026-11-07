"use strict";

const films = [...document.querySelectorAll("video[controls]")];
films.forEach(video => video.addEventListener("play", () => {
  films.forEach(other => { if (other !== video) other.pause(); });
}));
document.querySelectorAll("[data-play]").forEach(link => link.addEventListener("click", () => {
  const video = document.getElementById(link.dataset.play);
  video.play().catch(() => { video.focus(); });
}));

const background = document.getElementById("hero-background");
const motionToggle = document.querySelector(".hero-motion-toggle");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const connection = navigator.connection;
let introVisible = false;
let backgroundLoaded = false;
let backgroundPaused = false;
let backgroundFailed = false;

function updateBackground() {
  const motionAllowed = !reducedMotion.matches && !connection?.saveData && !backgroundFailed;
  motionToggle.hidden = !motionAllowed;
  const shouldPlay = motionAllowed && !backgroundPaused && introVisible && !document.hidden;
  if (!shouldPlay) {
    background.pause();
    if (!motionAllowed) background.classList.remove("is-ready");
    return;
  }
  // Keep video URLs inert until motion and data preferences allow playback.
  if (!backgroundLoaded) {
    background.querySelectorAll("source[data-src]").forEach(source => {
      source.src = source.dataset.src;
    });
    background.muted = true;
    background.load();
    backgroundLoaded = true;
  }
  background.play().catch(() => { background.classList.remove("is-ready"); });
}

background.addEventListener("playing", () => background.classList.add("is-ready"));
background.addEventListener("error", () => {
  backgroundFailed = true;
  updateBackground();
});
motionToggle.addEventListener("click", () => {
  backgroundPaused = !backgroundPaused;
  motionToggle.dataset.paused = String(backgroundPaused);
  motionToggle.setAttribute("aria-label", backgroundPaused ? "Play background animation" : "Pause background animation");
  updateBackground();
});
reducedMotion.addEventListener("change", updateBackground);
connection?.addEventListener("change", updateBackground);
new IntersectionObserver(entries => {
  introVisible = entries[0].isIntersecting;
  updateBackground();
}, { threshold: .05 }).observe(document.querySelector(".hero-intro"));
document.addEventListener("visibilitychange", () => {
  if (document.hidden) films.forEach(video => video.pause());
  updateBackground();
});
updateBackground();
