import express from "express";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Fuse from "fuse.js";//It supports partial matches, spelling mistakes, and is very fast.

const app = express();
const port = 3000;
var username="saineka@gmail.com";
var userpassword="Saineka@123";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let reviews = {};
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
  .filter(place => place.rating > 4.0)
  .slice(0, 9);

app.get("/", (req, res) => {
  res.render("index.ejs", { gallery, topAttractions, topRestaurants });
});


app.get("/placedetails/:id", (req, res) => {
  const placeId = req.params.id;

  const place = attractions.find((p) => p.id === placeId) || restaurants.find((p) => p.id === placeId);

  if (!place) return res.status(404).send("Place not found");

  res.render("placedetails.ejs", { place, reviews });
});


app.get("/attractionslist", (req, res) => {
  res.render("attractionslist.ejs",{attractions});
});
app.get("/restaurantslist", (req, res) => {
  res.render("restaurantslist.ejs",{restaurants});
});
app.get("/gallery", (req, res) => {
  res.render("gallery.ejs",{gallery});
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

//search
// Combine attractions and restaurants for search
// Combine attractions and restaurants for search
const allPlaces = [...attractions, ...restaurants];

// Configure Fuse.js options for typo tolerance
const fuseOptions = {
  keys: ["name", "address"],
  includeScore: true,
  threshold: 0.5,        // allows minor typos
  distance: 100,         // how far the match can be
  minMatchCharLength: 2, // ignore very short matches
  ignoreLocation: true
};

const fuse = new Fuse(allPlaces, fuseOptions);

app.get("/search", (req, res) => {
  const query = (req.query.q || "").trim().toLowerCase();

  if (!query) {
    // Show all places alphabetically if query is empty
    const sorted = allPlaces.sort((a, b) => a.name.localeCompare(b.name));
    return res.render("searchResults.ejs", { query: "", results: sorted });
  }

  // 1️⃣ Exact starts-with match (highest priority)
  let results = allPlaces.filter(place =>
    place.name.toLowerCase().startsWith(query)
  );

  // 2️⃣ If no starts-with matches, do fuzzy search
  if (results.length === 0) {
    results = fuse.search(query)
      .sort((a, b) => a.score - b.score) // best matches first
      .map(r => r.item);
  }

  // 3️⃣ Optional: if you want, merge starts-with + fuzzy (starts-with first)
  // let fuzzyResults = fuse.search(query).map(r => r.item);
  // results = [...results, ...fuzzyResults.filter(r => !results.includes(r))];

  res.render("searchResults.ejs", { query, results });
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
