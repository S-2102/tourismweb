import express from "express";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
var username="saineka@gmail.com";
var userpassword="Saineka@123";
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/placedetails.html", (req, res) => {
  res.sendFile(__dirname + "/placedetails.html");
});

app.get("/placeslist.html", (req, res) => {
  res.sendFile(__dirname + "/placeslist.html");
});

app.post("/login", (req,res)=>{
  const{email,password}=req.body;
  if(email === username && password === userpassword){
    
    res.send("<h1>Logged In Succesfully</h1>");
  }
  else{
    res.redirect("/");
    console.log(req.body);
  }
})

app.post("/register", (req,res)=>{
   const{email,password}=req.body;
  if(email === username && password === userpassword){
    
    res.send("<h1>Registered Succesfully</h1>");
  }
  else{
    res.redirect("/");
    console.log(req.body);
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
