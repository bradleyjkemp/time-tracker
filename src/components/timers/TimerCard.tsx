/** @jsx h */
import { h } from "preact";

export const TimerCard = (timer) => (
  <div class="column is-one-third" id="timer-${timer.id}">
    <div class="card">
      <header class="card-header">
        <div class="card-header-title">
          <span class="tag is-light">#2</span>
          {timer.title}
        </div>
        {(!timer.activatedAt && (
          <a
            hx-delete="/timers/${timer.id}"
            hx-target="#timer-${timer.id}"
            hx-swap="outerHTML"
            hx-confirm="Delete '${timer.title}'?"
            class="card-header-icon"
            aria-label="more options"
          >
            <span class="icon">
              <button type="button" class="delete" />
            </span>
          </a>
        )) ||
          ""}
      </header>
      <footer class="card-footer">
        <div class="card-footer-item">
          {(timer.activatedAt && (
            <button
              type="button"
              class="button is-danger"
              hx-post={`/timers/${timer.id}/stop`}
            >
              Stop
            </button>
          )) || (
            <button
              type="button"
              class="button is-primary"
              hx-post={`/timers/${timer.id}/start`}
            >
              Start
            </button>
          )}
        </div>
      </footer>
    </div>
  </div>
);
