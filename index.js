const express = require("express");
const graphql = require("graphql");
const express_graphql = require("express-graphql");
const app = express();
const auth = require("./middlewares/auth").auth;

app.use(express.json(), auth, (req, res, next) => {
	console.log(req.token_data);
	next();
});

app.get("/", (req, res) => {
	res.json("hi");
});

app.listen(4000, () => {
	console.log("port = 4000");
});