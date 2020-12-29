import "store2";
import "nanoid";
import { nanoid } from "nanoid";
import * as store from "store2";

const timerdb = store.namespace("timers");

export interface Timer {
  id: string;
  icon: string;
  title: string;
  activationCount: number;
  activatedAt: number;
}

const emoji = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/;
function iconFromTitle(title: string): string {
  const matches = emoji.exec(title);
  return matches ? matches[0] : title[0];
}

timerdb.keys().forEach((key) =>
  timerdb.transact(key, (timer: Timer) => {
    if (!timer.icon) {
      timer.icon = iconFromTitle(timer.title);
    }
    return timer;
  })
);

export function addTimer(timer: Timer) {
  timer.id = nanoid(10);
  if (!timer.icon) {
    timer.icon = iconFromTitle(timer.title);
  }
  timerdb.add(timer.id, timer);
}

export function removeTimer(id: string) {
  timerdb.remove(id);
}

export function getActiveTimer(): Timer | null {
  let timers = timerdb.getAll();
  // @ts-ignore
  for (const [id, timer] of Object.entries(timers)) {
    if (timer.activatedAt) {
      return timer;
    }
  }
}

export function listTimers(): Timer[] {
  let timers = [];
  timerdb.each((_, timer) => {
    timers.push(timer);
  });
  return timers;
}

export function startTimer(id: string) {
  timerdb.each((id, timer) => {
    if (timer.activatedAt) {
      timer.activatedAt = null;
    }
    timerdb.set(id, timer);
  });
  timerdb.transact(id, (timer: Timer) => {
    timer.activatedAt = Date.now();
    timer.activationCount++;
  });
}

export function stopTimer(id: string) {
  timerdb.transact(id, (timer) => {
    timer.activatedAt = null;
  });
}
