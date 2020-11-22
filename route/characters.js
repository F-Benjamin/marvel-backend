require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();

const uid2 = require("uid2");
const md5 = require("md5");

const publicKey = process.env.API_PUBLIC_KEY;
const privateKey = process.env.API_PRIVATE_KEY;
const toto = uid2(16);

const hash = md5(toto + privateKey + publicKey);

router.get("/characters", async (req, res) => {
  try {
    const { page, characterName } = req.query;

    const offset = page * 100 - 100;

    let searchCharacter;

    if (characterName !== "") {
      searchCharacter = `&nameStartsWith=${characterName}`;
    }

    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/characters?ts=${toto}&apikey=${publicKey}&hash=${hash}&orderBy=name&limit=100&offset=${offset}` +
        searchCharacter
    );

    res.status(200).json(response.data);
    // console.log(response);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/characters/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/characters/${id}?ts=${toto}&apikey=${publicKey}&hash=${hash}`
    );

    res.status(200).json(response.data.data.results);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/characters/:id/comics", async (req, res) => {
  try {
    const id = req.params.id;

    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/characters/${id}/comics?ts=${toto}&apikey=${publicKey}&hash=${hash}&orderBy=title&limit=50`
    );

    res.status(200).json(response.data.data.results);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
