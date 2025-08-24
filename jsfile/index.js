import express from "express";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(__dirname));  // serve all CSS, JS, HTML from current directory
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

app.get("/placedetails.html", (req, res) => {
  res.sendFile("placedetails.html", { root: __dirname });
});

app.get("/placeslist.html", (req, res) => {
  res.sendFile("placeslist.html", { root: __dirname });
});
