const { buildSchema } = require("graphql");
const express_graphql = require("express-graphql");

const owner_gql = express_graphql({
	schema: buildSchema(`
		type Query {
			hello: String
		}

		type user {
			name: String!
		}
		`),
	rootValue: { hello: () => "hi" },

	graphiql: false,
});

module.exports = { owner_gql };
