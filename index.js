const express = require("express");
const path = require("path");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/static", express.static(path.join(__dirname, "static")));
const htmlPath = path.join(__dirname, "static", "index.html");
app.get("/", (req, res) => {
  res.sendFile(htmlPath);
});
app.listen(PORT, console.log(`listen on Port: ${PORT}`));
