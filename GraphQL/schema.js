const { buildSchema } = require("graphql");

const owner_schema = buildSchema(`
		type Query {
			hello: String
		}

		type Mutation {
			addDepartment(department: Department): String
		}

		input Department {
			_id: String!,
			name: String!,
			admins: [User!]!
		}

		input User {
			name: String!,
			userid: String!,
			password: String!
		}

		type department {
			_id: String!,
			name: String!,
			admins: [user!]!
		}

		type user {
			name: String!,
			userid: String!,
			password: String!
		}
		`);

const schema = buildSchema(`
		type Query {
			hello: String
		}

		type user {
			name: String!
		}
		`);

module.exports = { schema, owner_schema };
