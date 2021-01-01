/** @jsx h */
import { h } from "preact";
import { Timer } from "../../dao";

export function ActiveTimer(props: { timer: Timer }) {
  if (!props.timer) {
    return (
      <div id="active-timer" class="column is-two-thirds" hx-swap-oob="true">
        <div class="card">
          <header class="card-header">
            <div class="card-header-title">No active timer</div>
          </header>
          <footer class="card-footer">
            <div class="card-footer-item">
              <button
                type="button"
                class="button is-primary"
                hx-get="/ui/createTimer"
                hx-target="#modal"
              >
                New Timer ➕
              </button>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  const duration = (Date.now() - props.timer.activatedAt) / 1000;
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  return (
    <div id="active-timer" class="column is-two-thirds" hx-swap-oob="true">
      <div class="columns">
        <div class="column">
          <div class="card">
            <header class="card-header">
              <div class="card-header-title">Timer Duration</div>
            </header>
            <div
              class="card-content"
              hx-get="/timers/active"
              hx-trigger="every 1s"
            >
              {minutes}m {seconds}s
            </div>
          </div>
        </div>
        <div class="column">
          <div class="card">
            <header class="card-header">
              <div class="card-header-title">
                <span class="tag is-light">#2</span>
                {props.timer.title}
              </div>
            </header>
            <footer class="card-footer">
              <div class="card-footer-item">
                <button
                  type="button"
                  class="button is-danger"
                  hx-post={`/timers/${props.timer.id}/stop`}
                >
                  Stop
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
