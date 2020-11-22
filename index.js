require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(formidable());

const uid2 = require("uid2");
const md5 = require("md5");

const charactersRoutes = require("./route/characters");
app.use(charactersRoutes);

const users = require("./route/users");
app.use(users);

mongoose.connect(process.env.BDD_ADRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.get("/comics", async (req, res) => {
  try {
    const publicKey = process.env.API_PUBLIC_KEY;
    const privateKey = process.env.API_PRIVATE_KEY;
    const toto = uid2(16);

    const hash = md5(toto + privateKey + publicKey);

    const { page, comicsTitle } = req.query;

    const offset = page * 100 - 100;

    let searchComics;

    if (comicsTitle !== "") {
      searchComics = `&titleStartsWith=${comicsTitle}`;
    }

    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/comics?ts=${toto}&apikey=${publicKey}&hash=${hash}&orderBy=title&limit=100&offset=${offset}` +
        searchComics
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error.message);
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Wrong way !" });
});

app.listen(process.env.PORT, () => {
  console.log("Started :))");
});
