const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

const WEEKDAY_JA = ["日", "月", "火", "水", "木", "金", "土"];

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

export function formatStart(iso) {
  const d = new Date(`${iso}T00:00:00`);
  return `starting ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function weekdayList({ weekday, weekdays }) {
  const raw = Array.isArray(weekdays) ? weekdays : weekday ? [weekday] : [];
  return WEEKDAYS.filter((d) => raw.includes(d));
}

export function formatWeekdays(days) {
  if (days.length === 1) return days[0];
  if (days.length === 2) return `${days[0]} and ${days[1]}`;
  return `${days.slice(0, -1).join(", ")}, and ${days.at(-1)}`;
}

export function whenPhrase(mode, opts) {
  const { date, time, monthDay, weeks, startDate, yearMonth, yearDay } = opts;
  if (!time) return "";
  const clock = formatClock(time);
  const start = startDate ? ` ${formatStart(startDate)}` : "";
  const days = weekdayList(opts);
  const dayText = days.length ? formatWeekdays(days) : "";
  if (mode === "once") {
    if (!date) return "";
    const d = new Date(`${date}T00:00:00`);
    return `on ${MONTHS[d.getMonth()]} ${d.getDate()} at ${clock}`;
  }
  if (mode === "daily") return `every day at ${clock}${start}`;
  if (mode === "weekday") return `every weekday at ${clock}${start}`;
  if (mode === "weekly") {
    if (!dayText) return "";
    return `every ${dayText} at ${clock}${start}`;
  }
  if (mode === "nweeks") {
    const n = Number(weeks);
    if (!Number.isInteger(n) || n < 1 || !startDate || !dayText) return "";
    const body = n === 1 ? `every ${dayText} at ${clock}` : `every ${n} weeks on ${dayText} at ${clock}`;
    return `${body}${start}`;
  }
  if (mode === "monthly") {
    const day = Number(monthDay);
    if (!day) return "";
    return `every month on the ${ordinal(day)} at ${clock}${start}`;
  }
  if (mode === "yearly") {
    const month = Number(yearMonth);
    const day = Number(yearDay);
    if (!month || !day) return "";
    return `every ${MONTHS[month - 1]} ${ordinal(day)} at ${clock}`;
  }
  return "";
}

export function buildRemind(input) {
  const who = whoPhrase(input.dest, input.name);
  const what = input.message.trim();
  const when = whenPhrase(input.mode, input);
  const missing = [];
  if (!who) missing.push(input.dest === "me" ? "宛先" : input.dest === "channel" ? "チャンネル名" : "ユーザー名");
  if (!what) missing.push("本文");
  if (!when) {
    if (input.mode === "once" && !input.date) missing.push("日付");
    if (!input.time) missing.push("時刻");
    if ((input.mode === "weekly" || input.mode === "nweeks") && !weekdayList(input).length) missing.push("曜日");
    if (input.mode === "nweeks") {
      const n = Number(input.weeks);
      if (!Number.isInteger(n) || n < 1) missing.push("週の間隔");
      if (!input.startDate) missing.push("開始日");
    }
    if (input.mode === "monthly" && !input.monthDay) missing.push("日");
    if (input.mode === "yearly") {
      if (!Number(input.yearMonth)) missing.push("月");
      if (!Number(input.yearDay)) missing.push("日");
    }
  }
  if (missing.length) return { ok: false, missing, command: "" };
  const body = quoteWhat(what);
  const command = who === "me"
    ? `/remind me to ${body} ${when}`
    : `/remind ${who} ${body} ${when}`;
  return { ok: true, missing: [], command };
}

export { WEEKDAYS, WEEKDAY_JA, MONTHS };
