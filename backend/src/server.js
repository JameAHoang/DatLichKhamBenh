import express from "express";
import bodyParser from "body-parser";
import viewEngign from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from "cors";
require("dotenv").config();
let app = express();

//CORS
app.use(cors({ credentials: true, origin: true }));
//config app

// app.use(bodyParser.json());
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   })
// );
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

viewEngign(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969; // Nếu port undefind => port 6969

app.listen(port, () => {
  //callback
  console.log("Backend Nodejs is runninng on the port :" + port);
});
