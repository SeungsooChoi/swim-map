const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.REACT_APP_SERVER_PORT || 3002;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", (req, res) => res.json({ username: "bryan" }));

const handleListening = () =>
  console.log(`✅  Listening on: http://localhost:${PORT}`);

app.listen(PORT, handleListening);
