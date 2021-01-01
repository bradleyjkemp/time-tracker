/** @jsx h */
import { h } from "preact";
import render from "preact-render-to-string";
import { server } from "./server";
import { CreateTimer } from "./components/modals/CreateTimer";

server.respondWith("GET", "/ui/empty", (xhr) => {
  return xhr.respond(200, {}, "");
});

server.respondWith("GET", "/ui/createTimer", (xhr) => {
  return xhr.respond(200, {}, render(<CreateTimer />));
});
