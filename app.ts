// external imports
import http from "http";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

// internal imports
import { appConfig } from "./config/app";
import { routes } from "./router";
import { env } from "./system/util";

// middleware
import { logger } from "./app/middlewares/logger";

// initialize
dotenv.config();
const app = express();
app.disable("x-powered-by");
const server = http.createServer(app);

// socket creation
const io = new Server(server);
global.io = io;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(env("COOKIE_SECRET")));


// custom middleware
app.use(logger);

//routes
routes(app);

app.listen(appConfig.port, () => {
  console.log(`Server is running on port ${appConfig.port}`);
});
