import express from "express";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const port = 3000;
var username="saineka@gmail.com";
var userpassword="Saineka@123";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read JSON file
const gallery = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "gallery.json"), "utf-8"));

app.use(express.static("assets"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs",{gallery});
});

app.get("/placedetails", (req, res) => {
  res.render("placedetails.ejs");
});

app.get("/placelist", (req, res) => {
  res.render("placelist.ejs");
});
app.get("/favourites", (req,res)=>{
  res.render("favourites.ejs");
})
app.get("/navigation", (req,res)=>{
  res.render("navigation.ejs");
})

app.post("/login", (req,res)=>{
  const{email,password}=req.body;
  if(email === username && password === userpassword){
    res.redirect("/");
  }
  else{
    res.send("<h1>Retry</h1>");
    console.log(req.body);
  }
})

app.post("/register", (req,res)=>{
   const{email,password}=req.body;
  if(email === username && password === userpassword){
    
    res.send("<h1>User Already Exists</h1>");
  }
  else{
    
    res.send("<h1>Regisered Successfully</h1>");
    console.log(req.body);
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
