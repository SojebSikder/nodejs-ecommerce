// external imports
import http from "http";
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
// internal imports
import { appConfig } from "./config/app";
import { routes } from "./routes/web";

// initialize
dotenv.config();
const app = express();
app.disable("x-powered-by");
const server = http.createServer(app);
// socket creation
const io = new Server(server);
global.io = io;

app.use(helmet());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(appConfig.cookieSecret));

// custom middleware


//routes
routes(app);

app.listen(appConfig.port, () => {
  console.log(`Server is running on port ${appConfig.port}`);
});
