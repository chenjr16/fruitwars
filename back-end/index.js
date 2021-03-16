const express = require("express");
const app = express();

const cors = require("cors");
const players = require("./leaderboard_db");

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

/*
/ Database connections
*/

// Start app
app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}.`);
});

/*
/  Routes--
*/

// Get
app.get("/", (req, res) => {
  res.send(players);
});

// Post
app.post("/", (req, res) => {
  console.log("Post at root directory");
});

// Delete
app.delete("/", (req, res) => {
  console.log("Delete at root directory");
});

// Put
app.put("/", (req, res) => {
  console.log("Put at root directory");
});
