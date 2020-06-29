const express = require("express");
const graphql = require("graphql");
const express_graphql = require("express-graphql");
const app = express();
const auth = require("./middlewares/auth").auth;
const url = require("url");
const schema = require("./GraphQL/schema");
const { buildSchema } = require("graphql");

app.use(express.json(), auth, (req, res, next) => {
	console.log(req.token_data);
	next();
});

app.get("/", (req, res) => {
	res.redirect(
		url.format({
			pathname: "/" + req.token_data.role,
			query: req.query,
		})
	);
});

app.get(
	"/owner",
	(req, res, next) => {
		req.token_data.role === "owner" ? next() : res.json("unauthorized access.");
	},
	express_graphql({
		schema: buildSchema(`type Query {
    test: String!}`),
		rootValue: function test() {
			return "hi";
		},
		graphiql: false,
	})
);

app.get(
	"/employee",
	(req, res, next) => {
		req.token_data.role === "employee"
			? next()
			: res.json("unauthorized access.");
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
			: res.json("unauthorized access.");
	},
	(req, res) => {
		res.json(req.token_data);
	}
);

app.listen(4000, () => {
	console.log("port = 4000");
});
