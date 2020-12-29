import "./styles.scss";
import "htmx.org/dist/htmx.js";
import "./burger-toggles";
import * as React from "./lib/jsx"; // Use a custom (non-React) JSX
import "./ui";
import "./timers";

// @ts-ignore
// window.htmx.logAll();

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    const foo = "sw.js";
    navigator.serviceWorker.register(foo);
  }
});
