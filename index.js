const express = require("express");
const app = express();
const auth = require("./middlewares/auth").auth;
const express_graphql = require("express-graphql");
const { schema } = require("./GraphQL/schema");
const { resolver } = require("./GraphQL/resolvers");

app.use(express.json(), auth);

app.use(
	"/",
	((req) =>
		express_graphql((req) => ({
			schema,
			rootValue: resolver(req),
			graphiql: false,
		})))()
);

app.listen(4000, () => {
	console.log("port = 4000");
});
