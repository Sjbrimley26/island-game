const express = require("express");

const app = express();
const port = 3333;

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: './dist/' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
