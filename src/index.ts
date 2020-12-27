// import {faStopwatch} from "@fortawesome/fontawesome-free";
import "./styles.scss";
import "htmx.org/dist/htmx.js";
import "./burger-toggles";
import { fakeServer } from "nise";
import {
  Timer,
  addTimer,
  getActiveTimer,
  listTimers,
  removeTimer,
  startTimer,
  stopTimer,
} from "./dao";

let server = fakeServer.create();
server.respondImmediately = true; // we want all requests to be responded to immediately (not batched or delayed)

// @ts-ignore
// window.htmx.logAll();

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    const foo = "sw.js";
    navigator.serviceWorker.register(foo);
  }
});

server.respondWith("PUT", "/timers", function (xhr) {
  const newTimer = {};
  const submitted = new URLSearchParams(xhr.requestBody);
  submitted.forEach((value, key) => (newTimer[key] = value));

  addTimer(<Timer>newTimer);
  return xhr.respond(200, {}, `<div></div>` + renderAllTimers());
});

server.respondWith("GET", "/timers/active", (xhr) => {
  return xhr.respond(200, {}, renderActiveTimer());
});

server.respondWith("GET", "/timers", (xhr) => {
  return xhr.respond(200, {}, renderAllTimers());
});

server.respondWith("DELETE", "/timers/:id", function (xhr, id) {
  removeTimer(id);
  return xhr.respond(200, {}, "");
});

server.respondWith("POST", "/timers/:id/start", function (xhr, id) {
  startTimer(id);

  return xhr.respond(200, {}, renderActiveTimer() + renderAllTimers());
});

server.respondWith("POST", "/timers/:id/stop", function (xhr, id) {
  const timer = getActiveTimer();
  stopTimer(id);

  const format = (d: Date) =>
    `${d.getUTCFullYear()}${
      d.getUTCMonth() + 1 // JavaScript, wtf is wrong with you?
    }${d.getUTCDate()}T${d.getUTCHours()}${d.getUTCMinutes()}${d.getUTCSeconds()}Z`;

  const activated = new Date(timer.activatedAt);
  const stopped = new Date();
  const event = window.open(
    `https://calendar.google.com/calendar/u/0/r/eventedit?text=${
      timer.title
    }&dates=${format(activated)}/${format(stopped)}`,
    "createevent",
    "directories=0,titlebar=0,toolbar=0,location=0,status=0,menubar=0,scrollbars=no,resizable=no,width=800,height=400"
  );
  console.log("Created event");
  console.log(event.length);
  waitForEvent(event);

  return xhr.respond(200, {}, renderActiveTimer() + renderAllTimers());
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

server.respondWith("GET", "/ui/empty", (xhr) => {
  return xhr.respond(200, {}, "");
});

server.respondWith("GET", "/ui/createTimer", (xhr) => {
  return xhr.respond(
    200,
    {},
    `
<div class="modal is-active wrapper-modal" hx-target="#modal">
  <div class="modal-background" hx-get="/ui/empty"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">New Timer</p>
      <button class="delete" hx-get="/ui/empty"></button>
    </header>
    <form hx-put="/timers"">
      <section class="modal-card-body">
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input class="input" name="title" type="text" placeholder="Name for your new timer" autofocus>
              <input type="submit" hidden>
            </div>
          </div>
      </section>
      <footer class="modal-card-foot">
        <button type="submit" class="button is-success is-fullwidth">Create Timer</input>
      </footer>
    </form>
  </div>
</div>
`
  );
});

function renderActiveTimer() {
  const timer = getActiveTimer();
  if (!timer) {
    return `<div id="active-timer" class="column is-two-thirds" hx-swap-oob="true">
            <div class="card">
                <header class="card-header">
                  <div class="card-header-title">
                    No active timer
                  </div>
                </header>
                <footer class="card-footer">
                  <div class="card-footer-item">
                    <button type="button" class="button is-primary" hx-get="/ui/createTimer" hx-target="#modal">
                        New Timer ➕
                    </button>
                  </div>
                </footer>
            </div>
        </div>
</div>`;
  }
  const duration = (Date.now() - timer.activatedAt) / 1000;
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return `
<div id="active-timer" class="column is-two-thirds" hx-swap-oob="true">
  <div class="columns">
    <div class="column">
      <div class="card">
        <header class="card-header">
          <div class="card-header-title">
            Timer Duration
          </div>
        </header>
        <div class="card-content" hx-get="/timers/active" hx-trigger="every 1s">
           ${minutes}m ${seconds}s
        </div>
      </div>
    </div>
    <div class="column">
      <div class="card">
        <header class="card-header">
          <div class="card-header-title">
            <span class="tag is-light">#2</span>
            ${timer.title}
          </div>
        </header>
        <footer class="card-footer">
          <div class="card-footer-item">
            <button type = "button" class="button is-danger" hx-post="/timers/${timer.id}/stop">
                Stop
            </button>
          </div>
        </footer>
      </div>
    </div>
  </div>
</div>`;
}

function renderAllTimers() {
  const timers = listTimers().sort(
    (a, b) => b.activationCount - a.activationCount
  );
  if (!timers) {
    return `<div id="all-timers" class="columns is-multiline" hx-swap-oob="true"></div>`;
  }

  let body = `<div id="all-timers" class="columns is-multiline" hx-swap-oob="true">`;
  for (const timer of timers) {
    body += `
        <div class="column is-one-third" id="timer-${timer.id}">
          <div class="card">
            <header class="card-header">
              <div class="card-header-title">
                <span class="tag is-light">#2</span>
                ${timer.title}
              </div>
              ${
                (!timer.activatedAt &&
                  `<a hx-delete="/timers/${timer.id}" hx-target="#timer-${timer.id}" hx-swap="outerHTML" hx-confirm="Delete '${timer.title}'?" class="card-header-icon" aria-label="more options">
                <span class="icon">
                  <button type="button" class="delete"></button>
                </span>
              </a>`) ||
                ""
              }
            </header>
            <footer class="card-footer">
              <div class="card-footer-item">
              ${
                (timer.activatedAt &&
                  `<button type = "button" class="button is-danger" hx-post="/timers/${timer.id}/stop">
                    Stop
                </button>`) ||
                `<button type = "button" class="button is-primary" hx-post="/timers/${timer.id}/start">
                    Start
                </button>`
              }
              </div>
            </footer>
          </div>
        </div>
`;
  }
  body += `</div>`;
  return body;
}
