import { buildRemind, formatClock, ordinal, quoteWhat } from "./remind.js";
import { strict as assert } from "node:assert";

assert.equal(formatClock("17:00"), "5:00pm");
assert.equal(ordinal(1), "1st");
assert.equal(quoteWhat('週報を書いて共有する'), '"週報を書いて共有する"');

const weekly = buildRemind({
  dest: "me",
  name: "",
  message: "週報を書く",
  mode: "weekly",
  date: "",
  time: "17:00",
  weekday: "Friday",
  monthDay: "",
});
assert.equal(weekly.ok, true);
assert.equal(weekly.command, '/remind me to "週報を書く" every Friday at 5:00pm');

const channel = buildRemind({
  dest: "channel",
  name: "general",
  message: "standup",
  mode: "once",
  date: "2026-03-15",
  time: "10:00",
  weekday: "",
  monthDay: "",
});
assert.ok(channel.command.startsWith("/remind #general "));
assert.ok(!channel.command.includes(" me "));

const incomplete = buildRemind({
  dest: "me",
  name: "",
  message: "x",
  mode: "monthly",
  date: "",
  time: "09:00",
  weekday: "",
  monthDay: "",
});
assert.equal(incomplete.ok, false);
assert.ok(incomplete.missing.includes("日"));

const nweeks = buildRemind({
  dest: "me",
  name: "",
  message: "点検",
  mode: "nweeks",
  date: "",
  time: "09:30",
  weekday: "",
  monthDay: "",
  weeks: "3",
  startDate: "2026-09-07",
});
assert.equal(
  nweeks.command,
  '/remind me to "点検" every 3 weeks on Monday at 9:30am starting September 7, 2026',
);

const later = buildRemind({
  dest: "me",
  name: "",
  message: "点検",
  mode: "nweeks",
  date: "",
  time: "09:30",
  weekday: "",
  monthDay: "",
  weeks: "3",
  startDate: "2026-09-14",
});
assert.equal(
  later.command,
  '/remind me to "点検" every 3 weeks on Monday at 9:30am starting September 14, 2026',
);

const yearly = buildRemind({
  dest: "me",
  name: "",
  message: "更新",
  mode: "yearly",
  date: "",
  time: "09:30",
  weekday: "",
  monthDay: "",
  weeks: "",
  startDate: "2026-09-07",
});
assert.equal(yearly.command, '/remind me to "更新" every September 7th at 9:30am');

console.log("ok");
