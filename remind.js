const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

export function ordinal(n) {
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) return `${n}st`;
  if (j === 2 && k !== 12) return `${n}nd`;
  if (j === 3 && k !== 13) return `${n}rd`;
  return `${n}th`;
}

export function formatClock(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "pm" : "am";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")}${ampm}`;
}

export function quoteWhat(text) {
  return `"${text.replaceAll('"', "'")}"`;
}

export function whoPhrase(dest, name) {
  if (dest === "me") return "me";
  const raw = name.trim().replace(/^[#@]/, "");
  if (!raw) return "";
  if (/\s/.test(raw)) return "";
  return dest === "channel" ? `#${raw}` : `@${raw}`;
}

export function whenPhrase(mode, { date, time, weekday, monthDay, weeks }) {
  if (!time) return "";
  const clock = formatClock(time);
  if (mode === "once") {
    if (!date) return "";
    const d = new Date(`${date}T00:00:00`);
    return `on ${MONTHS[d.getMonth()]} ${d.getDate()} at ${clock}`;
  }
  if (mode === "daily") return `every day at ${clock}`;
  if (mode === "weekday") return `every weekday at ${clock}`;
  if (mode === "weekly") {
    if (!weekday) return "";
    return `every ${weekday} at ${clock}`;
  }
  if (mode === "nweeks") {
    const n = Number(weeks);
    if (!Number.isInteger(n) || n < 1 || !weekday) return "";
    if (n === 1) return `every ${weekday} at ${clock}`;
    return `every ${n} weeks on ${weekday} at ${clock}`;
  }
  if (mode === "monthly") {
    const day = Number(monthDay);
    if (!day) return "";
    return `every month on the ${ordinal(day)} at ${clock}`;
  }
  return "";
}

export function buildRemind({ dest, name, message, mode, date, time, weekday, monthDay, weeks }) {
  const who = whoPhrase(dest, name);
  const what = message.trim();
  const when = whenPhrase(mode, { date, time, weekday, monthDay, weeks });
  const missing = [];
  if (!who) missing.push(dest === "me" ? "宛先" : dest === "channel" ? "チャンネル名" : "ユーザー名");
  if (!what) missing.push("本文");
  if (!when) {
    if (mode === "once" && !date) missing.push("日付");
    if (!time) missing.push("時刻");
    if ((mode === "weekly" || mode === "nweeks") && !weekday) missing.push("曜日");
    if (mode === "nweeks") {
      const n = Number(weeks);
      if (!Number.isInteger(n) || n < 1) missing.push("週の間隔");
    }
    if (mode === "monthly" && !monthDay) missing.push("日");
  }
  if (missing.length) return { ok: false, missing, command: "" };
  const body = quoteWhat(what);
  const command = who === "me"
    ? `/remind me to ${body} ${when}`
    : `/remind ${who} ${body} ${when}`;
  return { ok: true, missing: [], command };
}

export { WEEKDAYS };
