import express from "express";

/**
 * Express framework adapter.
 */
export class ExpressAdapter {
  instance() {
    return express;
  }
  app() {
    return express();
  }
}
