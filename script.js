"use strict";

const videos = [...document.querySelectorAll("video")];
videos.forEach(video => video.addEventListener("play", () => {
  videos.forEach(other => { if (other !== video) other.pause(); });
}));
document.querySelectorAll("[data-play]").forEach(link => link.addEventListener("click", () => {
  const video = document.getElementById(link.dataset.play);
  video.play().catch(() => { video.focus(); });
}));

document.addEventListener("visibilitychange", () => {
  if (document.hidden) videos.forEach(video => video.pause());
});
