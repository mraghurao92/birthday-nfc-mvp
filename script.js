// Premium NFC Birthday MVP (static, GitHub Pages friendly)

const $ = (sel) => document.querySelector(sel);

const modal = $("#modal");
const modalImg = $("#modalImg");
const modalTitle = $("#modalTitle");
const closeBtns = [$("#modalClose"), $("#modalX")];

function openModal(src, title = "Preview") {
  modalTitle.textContent = title;
  modalImg.src = src;
  modalImg.alt = title;
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  modal.setAttribute("aria-hidden", "true");
  modalImg.src = "";
  document.body.style.overflow = "";
}

closeBtns.forEach((b) => b?.addEventListener("click", closeModal));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
});

// Open signed card photo
$("#openCardPhoto")?.addEventListener("click", () => {
  openModal("assets/birthday-card-messages.jpg", "Birthday card messages");
});

// Gallery placeholders open modal (works once you replace placeholders with real images)
document.querySelectorAll(".gallery__item").forEach((btn) => {
  btn.addEventListener("click", () => {
    const src = btn.getAttribute("data-img");
    openModal(src, "Moment");
  });
});

// Share button
$("#shareBtn")?.addEventListener("click", async () => {
  const url = window.location.href;
  try {
    if (navigator.share) {
      await navigator.share({ title: document.title, text: "Tap to open ✨", url });
    } else {
      await navigator.clipboard.writeText(url);
      toast("Link copied!");
    }
  } catch {
    // ignore
  }
});

// Optional audio toggle (requires assets/ambient.mp3)
const audio = $("#audio");
const soundBtn = $("#soundToggle");
let soundOn = false;

soundBtn?.addEventListener("click", async () => {
  if (!audio) return;
  try {
    if (!soundOn) {
      await audio.play();
      soundOn = true;
      soundBtn.querySelector(".iconbtn__label").textContent = "Sound on";
      toast("Sound on");
    } else {
      audio.pause();
      soundOn = false;
      soundBtn.querySelector(".iconbtn__label").textContent = "Sound";
      toast("Sound off");
    }
  } catch {
    toast("Add assets/ambient.mp3 to enable sound.");
  }
});

// Tiny toast (no libs)
let toastTimer = null;
function toast(msg) {
  const existing = document.getElementById("toast");
  if (existing) existing.remove();

  const el = document.createElement("div");
  el.id = "toast";
  el.textContent = msg;
  Object.assign(el.style, {
    position: "fixed",
    left: "50%",
    bottom: "20px",
    transform: "translateX(-50%)",
    padding: "10px 12px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,.14)",
    background: "rgba(0,0,0,.55)",
    color: "rgba(255,255,255,.92)",
    fontSize: "12px",
    zIndex: 100,
    backdropFilter: "blur(10px)",
  });
  document.body.appendChild(el);

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), 1800);
}

// Guestbook (static site friendly): LocalStorage
const STORAGE_KEY = "birthday_guestbook_v1";
const form = $("#guestbookForm");
const list = $("#guestbookList");
const clearBtn = $("#clearGuestbook");

function loadGuestbook() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveGuestbook(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
function renderGuestbook() {
  if (!list) return;
  const items = loadGuestbook();
  list.innerHTML = "";

  if (items.length === 0) {
    const empty = document.createElement("div");
    empty.className = "gbItem";
    empty.innerHTML = `<div class="gbItem__msg">No new messages yet. Add one above ✨</div>`;
    list.appendChild(empty);
    return;
  }

  items.slice().reverse().forEach((it) => {
    const el = document.createElement("div");
    el.className = "gbItem";
    el.innerHTML = `
      <div class="gbItem__top">
        <div class="gbItem__name">${escapeHtml(it.name)}</div>
        <div class="gbItem__time">${new Date(it.ts).toLocaleString()}</div>
      </div>
      <div class="gbItem__msg">${escapeHtml(it.message)}</div>
    `;
    list.appendChild(el);
  });
}
function escapeHtml(s) {
  return (s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const name = (fd.get("name") || "").toString().trim();
  const message = (fd.get("message") || "").toString().trim();

  if (!name || !message) return;

  const items = loadGuestbook();
  items.push({ name, message, ts: Date.now() });
  saveGuestbook(items);
  form.reset();
  renderGuestbook();
  toast("Added ✨");
});

clearBtn?.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  renderGuestbook();
  toast("Cleared");
});

renderGuestbook();

// ===== SURPRISE FEATURE (Simba) =====
const surpriseBtn = $("#surpriseBtn");
const surpriseReveal = $("#surpriseReveal");
const surpriseContent = surpriseReveal?.querySelector(".surprise__content");
const surpriseSuspense = surpriseReveal?.querySelector(".surprise__suspense");

let surpriseRevealed = false;

surpriseBtn?.addEventListener("click", () => {
  if (surpriseRevealed) return;
  surpriseRevealed = true;

  // Hide the button completely (feels cleaner than "disabled")
  surpriseBtn.style.display = "none";

  // Show reveal container and suspense only
  if (surpriseReveal) surpriseReveal.style.display = "block";
  if (surpriseSuspense) surpriseSuspense.style.display = "block";
  if (surpriseContent) surpriseContent.style.display = "none";

  // After 1 second, hide suspense and show the content
  setTimeout(() => {
    if (surpriseSuspense) surpriseSuspense.style.display = "none";
    if (surpriseContent) surpriseContent.style.display = "block";
  }, 1000);
});