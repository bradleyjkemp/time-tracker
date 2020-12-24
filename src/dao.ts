export interface Timer {
  id: number;
  title: string;
  activatedAt: Date;
}

export function addTimer(timer: Timer) {
  let timers = listTimers();
  timer.id = Date.now();
  timers.push(<Timer>timer);
  window.localStorage.setItem("timers", JSON.stringify(timers));
}

export function removeTimer(id: number) {
  let timers = listTimers();
  timers = timers.filter((timer) => timer.id != id);
  window.localStorage.setItem("timers", JSON.stringify(timers));
}

export function getActiveTimer(): Timer | null {
  let timers = listTimers();
  for (const timer of timers) {
    if (timer.activatedAt) {
      return timer;
    }
  }
}

export function listTimers(): Timer[] {
  const timers = <Timer[]>JSON.parse(window.localStorage.getItem("timers"));
  if (timers) {
    return timers;
  }
  return [];
}

export function startTimer(id: number) {
  let timers = listTimers();
  timers = timers.map((timer) => {
    if (timer.id == id) {
      timer.activatedAt = new Date();
      return timer;
    }

    if (timer.activatedAt) {
      timer.activatedAt = null;
    }
    return timer;
  });
  window.localStorage.setItem("timers", JSON.stringify(timers));
}

export function stopTimer(id: number) {
  let timers = listTimers();
  timers = timers.map((timer) => {
    if (timer.id == id) {
      timer.activatedAt = null;
    }
    return timer;
  });
  window.localStorage.setItem("timers", JSON.stringify(timers));
}
