import { buildRemind, WEEKDAYS } from "./remind.js";

const form = document.getElementById("form");
const preview = document.getElementById("preview");
const hint = document.getElementById("hint");
const copyBtn = document.getElementById("copy");
const weekday = document.getElementById("weekday");

weekday.insertAdjacentHTML("beforeend", `<option value="">選ぶ</option>`);
for (const day of WEEKDAYS) {
  weekday.insertAdjacentHTML("beforeend", `<option value="${day}">${day}</option>`);
}

function fields() {
  return {
    dest: form.dest.value,
    name: form.name.value,
    message: form.message.value,
    mode: form.mode.value,
    date: form.date.value,
    time: form.time.value,
    weekday: form.weekday.value,
    monthDay: form.monthDay.value,
    weeks: form.weeks.value,
    startDate: form.startDate.value,
  };
}

function sync() {
  const dest = form.dest.value;
  form.name.hidden = dest === "me";
  form.name.required = dest !== "me";
  form.name.placeholder = dest === "channel" ? "general" : "username";
  document.getElementById("name-label").hidden = dest === "me";

  const mode = form.mode.value;
  document.getElementById("once-fields").hidden = mode !== "once";
  document.getElementById("week-fields").hidden = mode !== "weekly";
  document.getElementById("nweeks-fields").hidden = mode !== "nweeks";
  document.getElementById("start-fields").hidden = mode === "once";
  document.getElementById("month-fields").hidden = mode !== "monthly";

  const result = buildRemind(fields());
  preview.textContent = result.ok ? result.command : "（未入力があります）";
  hint.textContent = result.ok ? "" : `不足: ${result.missing.join("、")}`;
  copyBtn.disabled = !result.ok;
}

form.addEventListener("input", sync);
form.addEventListener("change", sync);

copyBtn.addEventListener("click", async () => {
  const result = buildRemind(fields());
  if (!result.ok) return;
  try {
    await navigator.clipboard.writeText(result.command);
    hint.textContent = "コピーしました。Slack に貼ってください。";
  } catch {
    preview.focus();
    preview.select();
    hint.textContent = "自動コピーできませんでした。プレビューを選択してコピーしてください。";
  }
});

sync();
