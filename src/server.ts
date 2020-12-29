import { fakeServer } from "nise";

export const server = fakeServer.create();
server.respondImmediately = true; // we want all requests to be responded to immediately (not batched or delayed)
