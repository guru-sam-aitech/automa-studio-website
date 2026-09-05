const options = ["Ship it", "Take a walk", "Build Decide It", "Coffee first", "Write the brief", "Play a round"];
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const colors = ["#1b1712", "#3a2c1c", "#c9a36a", "#e4c49a", "#8d6b3d", "#241c14"];
let angle = 0;
let spinning = false;

function drawWheel(rotation) {
  const r = canvas.width / 2;
  const slice = (Math.PI * 2) / options.length;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  options.forEach((label, i) => {
    const start = rotation + i * slice;
    ctx.beginPath();
    ctx.moveTo(r, r);
    ctx.arc(r, r, r - 4, start, start + slice);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.save();
    ctx.translate(r, r);
    ctx.rotate(start + slice / 2);
    ctx.fillStyle = i % 2 ? "#1a140c" : "#f6f1e8";
    ctx.font = "600 13px Outfit, sans-serif";
    ctx.fillText(label, 28, 4);
    ctx.restore();
  });
  ctx.beginPath();
  ctx.arc(r, r, 18, 0, Math.PI * 2);
  ctx.fillStyle = "#f6f1e8";
  ctx.fill();
}

drawWheel(0);

document.getElementById("spin").addEventListener("click", () => {
  if (spinning) return;
  spinning = true;
  const extra = Math.PI * 8 + Math.random() * Math.PI * 4;
  const start = performance.now();
  const from = angle;
  const duration = 2200;
  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const ease = 1 - Math.pow(1 - t, 3);
    angle = from + extra * ease;
    drawWheel(angle);
    if (t < 1) requestAnimationFrame(tick);
    else {
      spinning = false;
      const slice = (Math.PI * 2) / options.length;
      const index = Math.floor(((Math.PI * 2 - ((angle + Math.PI / 2) % (Math.PI * 2))) % (Math.PI * 2)) / slice);
      document.getElementById("result").textContent = options[index] || options[0];
    }
  }
  requestAnimationFrame(tick);
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-on"));
    chip.classList.add("is-on");
    const filter = chip.dataset.filter;
    document.querySelectorAll(".card").forEach((card) => {
      const tags = card.dataset.tags || "";
      card.classList.toggle("is-hidden", filter !== "all" && !tags.includes(filter));
    });
  });
});

const menu = document.getElementById("menu");
const nav = document.querySelector(".nav");
menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
});

document.getElementById("contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`;
  window.location.href = `mailto:hello@automatestudio.ie?subject=${encodeURIComponent("Project enquiry")}&body=${encodeURIComponent(body)}`;
});

document.getElementById("year").textContent = String(new Date().getFullYear());
