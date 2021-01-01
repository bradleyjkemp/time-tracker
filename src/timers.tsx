/** @jsx h */
import { server } from "./server";
import { h } from "preact";
import render from "preact-render-to-string";
import {
  addTimer,
  getActiveTimer,
  listTimers,
  removeTimer,
  startTimer,
  stopTimer,
  Timer,
} from "./dao";
import { TimerList } from "./components/timers/TimerList";
import { ActiveTimer } from "./components/timers/ActiveTimer";

server.respondWith("PUT", "/timers", function (xhr) {
  const newTimer = {};
  const submitted = new URLSearchParams(xhr.requestBody);
  submitted.forEach((value, key) => (newTimer[key] = value));

  addTimer(newTimer as Timer);
  return xhr.respond(
    200,
    {},
    `<div></div>` + render(<TimerList timers={listTimers()} />)
  );
});

server.respondWith("GET", "/timers/active", (xhr) => {
  return xhr.respond(200, {}, render(<ActiveTimer timer={getActiveTimer()} />));
});

server.respondWith("GET", "/timers", (xhr) => {
  return xhr.respond(200, {}, render(<TimerList timers={listTimers()} />));
});

server.respondWith("DELETE", "/timers/:id", function (xhr, id) {
  removeTimer(id);
  return xhr.respond(200, {}, "");
});

server.respondWith("POST", "/timers/:id/start", function (xhr, id) {
  startTimer(id);

  return xhr.respond(
    200,
    {},
    render(<ActiveTimer timer={getActiveTimer()} />) +
      render(<TimerList timers={listTimers()} />)
  );
});

server.respondWith("POST", "/timers/:id/stop", function (xhr, id) {
  const timer = getActiveTimer();
  stopTimer(id);

  const pad = (n: number) => n.toString(10).padStart(2, "0");
  const format = (d: Date) =>
    `${d.getUTCFullYear()}${
      pad(d.getUTCMonth() + 1) // JavaScript, wtf is wrong with you?
    }${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(
      d.getUTCMinutes()
    )}${pad(d.getUTCSeconds())}Z`;

  const activated = new Date(timer.activatedAt);
  const stopped = new Date();
  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${
    timer.title
  }&dates=${format(activated)}/${format(stopped)}`;
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    // assign URL directly to prevent a double window animation (i.e. one to open google.com/calendar and a second where the calendar app takes over)
    window.location.assign(url);
  } else {
    const e = window.open(
      url,
      "createevent",
      "directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no,width=800,height=400"
    );
    waitForEvent(e);
  }

  return xhr.respond(
    200,
    {},
    render(<ActiveTimer timer={getActiveTimer()} />) +
      render(<TimerList timers={listTimers()} />)
  );
});

function waitForEvent(calendar: Window) {
  // This is super brittle but equals the number of iframes in a Calendar window
  // after the user has clicked the "create event" button
  const eventDone = 7;

  const id = setInterval(() => {
    if (calendar.closed) {
      // user closed the popup themselves
      clearInterval(id);
      return;
    }
    if (calendar.length == eventDone) {
      // we think the user has clicked the "create event" button and so we should close the popup for them
      calendar.close();
      clearInterval(id);
    }
  }, 100);
}
