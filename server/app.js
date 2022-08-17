import express from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import path from "path";
import http from "http";
import _ from "lodash";
import indexRouter from "./routes/index";
import { API_PREFIXED } from "./routes/app.routes";


const app = express();
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

app.use(express.static(path.join(__dirname, '../assets')));

// End point of API
app.use(API_PREFIXED, indexRouter);

// testing routes for dev
app.get('/', async (req, res, next) => {

  const payload = {
    "api.v1": "1.0.0",
    "healthCheck": "Ok"
  };

  res.status(200).send(payload);
});


// catch 404 and forward to error handler.
app.use(function (req, res, next) {
  next({
    status: 404,
    message: "Not Found!"
  });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.status(err.status || 500).json({
    "status": err.status || 500,
    "message": err.message ? err.message : "Something went wrong."
  });
});


// Initialize the Server
/**
 * Get port from environment and store in Express.
 */
const PORT = process.env.PORT;
app.set("port", PORT);

/**
 * Create HTTP server.
 */
const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(PORT);
server.on('error', (error) => {

  switch (error.code) {
    case 'EACCES':
      console.error(`${PORT} requires elevated privileges`);
    case 'EADDRINUSE':
      console.error(`${PORT} is already in use`);
    default:
      console.log("error ===", error);
  }

});

server.on('listening', () => console.log(`App listening on ${PORT}`));
