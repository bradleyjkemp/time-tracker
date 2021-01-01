/* @jsx h */
import { Timer } from "../../dao";
import { h } from "preact";
import { TimerCard } from "./TimerCard";

export function TimerList(props: { timers: Timer[] }) {
  const timers = props.timers.sort(
    (a, b) => b.activationCount - a.activationCount
  );

  return (
    <div id="all-timers" class="columns is-multiline" hx-swap-oob="true">
      {timers.map((timer) => (
        <TimerCard {...timer} />
      ))}
    </div>
  );
}
