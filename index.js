import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "12345",
  port: 5432,
});
db.connect();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// use async to wait for response
app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM todolist ORDER BY id ASC;");
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: result.rows,
  });
});

app.post("/add", async (req, res) => {
  try {
    const result = await db.query("INSERT INTO todolist (title) VALUES ($1);", [
      req.body.newItem,
    ]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  try {
    const result = await db.query(
      "UPDATE todolist SET title =$1 WHERE id=$2;",
      [req.body.updatedItemTitle, req.body.updatedItemId]
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  try {
    const result = await db.query("Delete from todolist Where id=$1;", [
      req.body.deleteItemId,
    ]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
