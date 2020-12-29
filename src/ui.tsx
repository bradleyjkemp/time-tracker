/** @jsx h */
import { h } from "preact";
import render from "preact-render-to-string";
import { server } from "./server";

server.respondWith("GET", "/ui/empty", (xhr) => {
  return xhr.respond(200, {}, "");
});

server.respondWith("GET", "/ui/createTimer", (xhr) => {
  return xhr.respond(
    200,
    {},
    render(
      <div class="modal is-active wrapper-modal" hx-target="#modal">
        <div class="modal-background" hx-get="/ui/empty" />
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">New Timer</p>
            <button class="delete" hx-get="/ui/empty" />
          </header>
          <form hx-put="/timers">
            <section class="modal-card-body">
              <div class="field">
                <label class="label">Name</label>
                <div class="control">
                  <input
                    class="input"
                    name="title"
                    type="text"
                    placeholder="Name for your new timer"
                    autofocus
                  />
                  <input type="submit" hidden />
                </div>
              </div>
            </section>
            <footer class="modal-card-foot">
              <button type="submit" class="button is-success is-fullwidth">
                Create Timer
              </button>
            </footer>
          </form>
        </div>
      </div>
    )
  );
});
