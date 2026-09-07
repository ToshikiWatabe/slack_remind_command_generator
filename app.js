import { buildRemind, WEEKDAYS, WEEKDAY_JA, MONTHS } from "./remind.js";

const form = document.getElementById("form");
const preview = document.getElementById("preview");
const hint = document.getElementById("hint");
const copyBtn = document.getElementById("copy");
const weekdayBox = document.getElementById("weekday-box");
const yearMonth = document.getElementById("yearMonth");

WEEKDAYS.forEach((day, i) => {
  weekdayBox.insertAdjacentHTML(
    "beforeend",
    `<label class="check"><input type="checkbox" name="weekday" value="${day}"> ${WEEKDAY_JA[i]}</label>`,
  );
});
MONTHS.forEach((name, i) => {
  yearMonth.insertAdjacentHTML("beforeend", `<option value="${i + 1}">${i + 1}月</option>`);
});

function fields() {
  return {
    dest: form.dest.value,
    name: form.name.value,
    message: form.message.value,
    mode: form.mode.value,
    date: form.date.value,
    time: form.time.value,
    weekdays: [...form.querySelectorAll("input[name=weekday]:checked")].map((el) => el.value),
    monthDay: form.monthDay.value,
    weeks: form.weeks.value,
    startDate: form.startDate.value,
    yearMonth: form.yearMonth.value,
    yearDay: form.yearDay.value,
  };
}

function sync() {
  const dest = form.dest.value;
  const nameWrap = document.getElementById("name-fields");
  nameWrap.hidden = dest === "me";
  form.name.required = dest !== "me";
  form.name.placeholder = dest === "channel" ? "general" : "username";

  const mode = form.mode.value;
  document.getElementById("once-fields").hidden = mode !== "once";
  document.getElementById("week-fields").hidden = mode !== "weekly" && mode !== "nweeks";
  document.getElementById("nweeks-fields").hidden = mode !== "nweeks";
  document.getElementById("start-fields").hidden = mode === "once" || mode === "yearly";
  document.getElementById("start-req").hidden = mode !== "nweeks";
  form.startDate.required = mode === "nweeks";
  document.getElementById("month-fields").hidden = mode !== "monthly";
  document.getElementById("year-fields").hidden = mode !== "yearly";

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
