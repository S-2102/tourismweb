import express from "express";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Fuse from "fuse.js";
import session from "express-session";
import multer from "multer";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ---------------------- Helper functions ----------------------
function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
function readJSON(filePath, defaultValue) {
  if (!fs.existsSync(filePath)) return defaultValue;
  try {
    const data = fs.readFileSync(filePath, "utf-8").trim();
    return data ? JSON.parse(data) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultValue;
  }
}

// ---------------------- Paths ----------------------
const galleryPath = path.join(__dirname, "data", "gallery.json");
const attractionsPath = path.join(__dirname, "data", "attractions.json");
const restaurantsPath = path.join(__dirname, "data", "restaurants.json");
const usersPath = path.join(__dirname, "data", "users.json");
const reviewsPath = path.join(__dirname, "data", "reviews.json");


// ---------------------- Load JSON ----------------------
const gallery = readJSON(galleryPath, []);
const attractions = readJSON(attractionsPath, []);
const restaurants = readJSON(restaurantsPath, []);
let users = readJSON(usersPath, []);

// Ensure admin exists
if (!users.find(u => u.role === "admin")) {
  users.push({
    email: "saineka@example.com",
    password: "admin123",
    role: "admin",
    favorites: [],
    reviews: []
  });
  saveJSON(usersPath, users);
}

// Reviews storage
let reviews = readJSON(reviewsPath, {});


// ---------------------- Multer for uploads ----------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "assets/uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ---------------------- Middleware ----------------------
app.use(express.static("assets"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'mySuperSecretKey123',
  resave: false,
  saveUninitialized: false, // important for proper session handling
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Make user available in all EJS templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.favorites = req.session.user
  ? (users.find(u => u.email === req.session.user.email)?.favorites || [])
  : [];
  next();
});

// ---------------------- Fuse.js for search ----------------------
const allPlaces = [...attractions, ...restaurants];
const fuse = new Fuse(allPlaces, { keys: ["name", "address"], threshold: 0.5, minMatchCharLength: 2 });

// ---------------------- Routes ----------------------

// Home
app.get("/", (req, res) => {
  const topAttractions = attractions.filter(p => p.rating > 4.4).slice(0, 9);
  const topRestaurants = restaurants.filter(p => p.rating > 4.0).slice(0, 9);
  res.render("index.ejs", { gallery, topAttractions, topRestaurants });
});

// Place Details
app.get("/placedetails/:id", (req, res) => {
  const placeId = req.params.id;
  const place = attractions.find(p => p.id === placeId) || restaurants.find(p => p.id === placeId);
  if (!place) return res.status(404).send("Place not found");
  const placeReviews = reviews[placeId] || [];
  res.render("placedetails.ejs", { place, reviews: placeReviews });
});

// Lists
app.get("/attractionslist", (req, res) => res.render("attractionslist.ejs", { attractions }));
app.get("/restaurantslist", (req, res) => res.render("restaurantslist.ejs", { restaurants }));
app.get("/gallery", (req, res) => res.render("gallery.ejs", { gallery }));

// ---------------------- Auth ----------------------

// Register
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (users.find(u => u.email === email)) return res.send("<h1>User already exists</h1>");

  const newUser = { email, password, role: "user", favorites: [], reviews: [] };
  users.push(newUser);
  saveJSON(usersPath, users);

  req.session.user = newUser; // store the full user object in session
  res.redirect("/");
});

// Login
app.post("/login", (req, res) => {
 // Login
const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.send("<h1>Invalid Credentials</h1>");
  req.session.user = { email: user.email, role: user.role };
  if (user.role === "admin") return res.redirect("/admin");
  req.session.user = user; // store full user object in session
  res.redirect("/");

});

// Logout
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.send("Error logging out");
    res.redirect("/");
  });
});

// ---------------------- Search ----------------------
app.get("/search", (req, res) => {
  const query = (req.query.q || "").trim().toLowerCase();
  let results = allPlaces.filter(p => p.name.toLowerCase().startsWith(query));
  if (results.length === 0 && query) results = fuse.search(query).map(r => r.item);
  res.render("searchresults.ejs", { query, results });
});

// ---------------------- Reviews ----------------------
app.post("/submit-review", (req, res) => {
  if (!req.session.user) return res.send("Login required");

  const { placeId, reviewText, rating } = req.body;
  const email = req.session.user.email;

  if (!reviews[placeId]) reviews[placeId] = [];

  const review = {
    user: email,
    reviewText,
    rating: parseInt(rating),
    date: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
  };

  reviews[placeId].push(review);

  // Save to user's personal reviews too
  const user = users.find(u => u.email === email);
  if (user) {
    if (!user.reviews) user.reviews = [];
    user.reviews.push({ placeId, ...review });
    saveJSON(usersPath, users);
  }

  saveJSON(reviewsPath, reviews);
  res.redirect(`/placedetails/${placeId}`);
});

// ---------------------- Favorites ----------------------

// Toggle favorite via AJAX
app.post("/favorites/toggle/:id", (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "Login required" });

  const placeId = req.params.id; // from URL param
  const user = users.find(u => u.email === req.session.user.email);

  if (!user.favorites) user.favorites = [];

  let saved;
  if (user.favorites.includes(placeId)) {
    // Remove from favorites
    user.favorites = user.favorites.filter(id => id !== placeId);
    saved = false;
  } else {
    // Add to favorites
    user.favorites.push(placeId);
    saved = true;
  }

  // Save to JSON
  saveJSON(usersPath, users);

  // Update session so favorites page reads correct data
  req.session.user.favorites = user.favorites;

  res.json({ saved });
});

// Favourites page
app.get("/favourites", (req, res) => {
  if (!req.session.user) {
    // User not logged in → show empty favourites with message
    return res.render("favourites.ejs", { 
      favPlaces: [], 
      message: "You need to log in to see your favourite places." 
    });
  }

  const user = users.find(u => u.email === req.session.user.email);
  const favPlaces = allPlaces.filter(p => user.favorites.includes(p.id));
  res.render("favourites.ejs", { favPlaces, message: null, favorites: user.favorites });

});

// ---------------------- Admin ----------------------
function ensureAdmin(req, res, next) {
  if (!req.session.user) return res.redirect("/");
  if (req.session.user.role !== "admin") return res.status(403).send("<h1>Access Denied</h1>");
  next();
}

app.get("/admin", ensureAdmin, (req, res) => {
  res.render("admin.ejs", { users, reviews, attractions, restaurants });
});
app.post("/admin/delete-review", ensureAdmin, (req, res) => {
  const { placeId, index } = req.body;
  if (reviews[placeId]) {
    reviews[placeId].splice(index, 1);
    saveJSON(reviewsPath, reviews);
  }
  res.redirect("/admin");
});

// Admin delete/add routes
app.post("/admin/delete-user", ensureAdmin, (req, res) => {
  const { email } = req.body;
  users = users.filter(u => u.email !== email);
  saveJSON(usersPath, users);
  res.redirect("/admin");
});

app.post("/admin/delete-attraction", ensureAdmin, (req, res) => {
  const { id } = req.body;
  const index = attractions.findIndex(a => a.id === id);
  if (index !== -1) { attractions.splice(index, 1); saveJSON(attractionsPath, attractions); }
  res.redirect("/admin");
});

app.post("/admin/delete-restaurant", ensureAdmin, (req, res) => {
  const { id } = req.body;
  const index = restaurants.findIndex(r => r.id === id);
  if (index !== -1) { restaurants.splice(index, 1); saveJSON(restaurantsPath, restaurants); }
  res.redirect("/admin");
});

app.post("/admin/add-attraction", ensureAdmin, upload.single("image"), (req, res) => {
  const { name, location, latitude, longitude, rating, description } = req.body;
  const image = req.file ? "/uploads/" + req.file.filename : null;
  const id = Date.now().toString();
  attractions.push({ id, name, location, latitude, longitude, rating: parseFloat(rating) || 0, description, image });
  saveJSON(attractionsPath, attractions);
  res.redirect("/admin");
});

app.post("/admin/add-restaurant", ensureAdmin, upload.single("image"), (req, res) => {
  const { name, location, latitude, longitude, rating, price_range, description } = req.body;
  const image = req.file ? "/uploads/" + req.file.filename : null;
  const id = Date.now().toString();
  restaurants.push({ id, name, location, latitude, longitude, rating: parseFloat(rating) || 0, price_range, description, image });
  saveJSON(restaurantsPath, restaurants);
  res.redirect("/admin");
});

// ---------------------- Start server ----------------------
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
