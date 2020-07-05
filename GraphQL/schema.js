const { buildSchema } = require("graphql");

const schema = buildSchema(`
		type Query {
			readDepartments: [department]
		}

		type Mutation {
			createDepartment(department: Department): String
			deleteDepartment(_id: String!): String
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

module.exports = { schema };
