const express = require("express");
const graphql = require("graphql");
const express_graphql = require("express-graphql");
const app = express();
const auth = require("./middlewares/auth").auth;
const url = require("url");
const schema = require("./GraphQL/schema");
const { buildSchema } = require("graphql");
const { owner_gql } = require("./GraphQL/graphql");

app.use(express.json(), auth, (req, res, next) => {
	console.log(req.token_data);
	next();
});

app.get("/", (req, res) => {
	res.json("please use /" + req.token_data.role + " route");
});

app.get(
	"/owner",
	(req, res, next) => {
		req.token_data.role === "owner"
			? next()
			: res.json("unauthorized access. Use path /" + req.token_data.role);
	},
	owner_gql
);

app.get(
	"/employee",
	(req, res, next) => {
		req.token_data.role === "employee"
			? next()
			: res.json("unauthorized access. Use path /" + req.token_data.role);
	},
	(req, res) => {
		res.json(req.token_data);
	}
);

app.get(
	"/department",
	(req, res, next) => {
		req.token_data.role === "department"
			? next()
			: res.json("unauthorized access. Use path /" + req.token_data.role);
	},
	(req, res) => {
		res.json(req.token_data);
	}
);

app.listen(4000, () => {
	console.log("port = 4000");
});
