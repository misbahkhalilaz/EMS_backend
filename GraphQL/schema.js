const { buildSchema } = require("graphql");

const schema = buildSchema(`
		type Query {
			hello: String
		}

		type user {
			name: String!
		}
		`);

module.exports = { schema };
