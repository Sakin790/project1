const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "mysql-service",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root123",
  database: process.env.DB_NAME || "appdb",
  port: 3306,
});

// connect DB
db.connect((err) => {
  if (err) {
    console.log("DB connection failed ❌", err);
  } else {
    console.log("DB connected ✅");
  }
});

// test route
app.get("/", (req, res) => {
  res.send("API is running on port 8001 🚀");
});

// create table
app.get("/init", (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255)
    )
  `;

  db.query(sql, (err) => {
    if (err) return res.status(500).send(err);
    res.send("Table created ✅");
  });
});

// insert user
app.post("/user", (req, res) => {
  const { name } = req.body;

  db.query("INSERT INTO users (name) VALUES (?)", [name], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ id: result.insertId, name });
  });
});

// get users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

app.listen(8001, () => {
  console.log("API running on port 8001 🚀");
});