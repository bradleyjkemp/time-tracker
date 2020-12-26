// import {faStopwatch} from "@fortawesome/fontawesome-free";
import "./styles.scss";
import "htmx.org/dist/htmx.js";
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
window.htmx.logAll();

server.respondWith("PUT", "/timers", function (xhr) {
  console.log(xhr);
  const newTimer = {};
  const submitted = new URLSearchParams(xhr.requestBody);
  submitted.forEach((value, key) => (newTimer[key] = value));

  addTimer(<Timer>newTimer);
  return xhr.respond(200, {}, renderAllTimers());
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
  stopTimer(id);

  return xhr.respond(200, {}, renderActiveTimer() + renderAllTimers());
});

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
    <section class="modal-card-body">
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
          <form hx-put="/timers"">
            <input class="input" name="title" type="text" placeholder="Name for your new timer" autofocus>
            <input type="submit" hidden>
          </form>
          </div>
        </div>
    </section>
    <footer class="modal-card-foot">
      <a class="button is-success is-fullwidth">Start Timer</a>
    </footer>
  </div>
</div>
`
  );
});

function renderActiveTimer() {
  const timers = listTimers();

  // @ts-ignore
  const active = getActiveTimer();
  if (!active) {
    return `<div id="active-timer" hx-swap-oob="true"><p>No Active Timers</p></div>`;
  }
  return `<div id="active-timer" hx-swap-oob="true"><p>Active Timer: ${active.title}</p></div>`;
}

function renderAllTimers() {
  const timers = listTimers();
  if (!timers) {
    return "";
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
              <a hx-delete="/timers/${timer.id}" hx-target="#timer-${
      timer.id
    }" hx-swap="outerHTML" class="card-header-icon" aria-label="more options">
                <span class="icon">
                  <button type="button" class="delete"></button>
                </span>
              </a>
            </header>
            <footer class="card-footer">
              <div class="card-footer-item">
              ${
                (timer.activatedAt &&
                  `<button type = "button" class="button is-danger is-outlined" hx-post="/timers/${timer.id}/stop">
                    Stop
                </button>`) ||
                `<button type = "button" class="button is-primary is-outlined" hx-post="/timers/${timer.id}/start">
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
