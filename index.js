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
// read attractions and restaurants json file
const attractions = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "attractions.json"), "utf-8"));
const restaurants = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "restaurants.json"), "utf-8"));


app.use(express.static("assets"));
app.use(bodyParser.urlencoded({ extended: true }));

const topAttractions = attractions
  .filter(place => place.rating > 4.4)
  .slice(0, 9);

const topRestaurants = restaurants
  .filter(place => place.rating > 4.4)
  .slice(0, 9);

app.get("/", (req, res) => {
  res.render("index.ejs", { gallery, topAttractions, topRestaurants });
});

app.get("/placedetails/:id", (req, res) => {
  const placeId = req.params.id; // id since it is a string

  // searching in attractions or restaurants
  const place = attractions.find(p => p.id === placeId) 
             || restaurants.find(p => p.id === placeId);

  if (!place) {
    return res.status(404).send("Place not found");
  }

  res.render("placedetails.ejs", { place });
});

app.get("/placelist", (req, res) => {
  res.render("placelist.ejs");
});

app.get("/favourites", (req,res)=>{
  res.render("favourites.ejs");
})
app.get("/navigation/:id", (req, res) => {
  const placeId = parseInt(req.params.id);
  const place = attractions.find(p => p.id === placeId) || restaurants.find(p => p.id === placeId);

  if (!place) return res.send("Place not found");

  res.render("navigation.ejs", { place, attractions, restaurants });
});

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
