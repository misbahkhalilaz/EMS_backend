const { buildSchema } = require("graphql");

const schema = buildSchema(`
		type Query {
			readDepartments: [department]
		}

		type Mutation {
			createDepartment(department: Department): Int
			deleteDepartment(_id: String!): Int
			updateDepartment(_id: String!, department: Department): Int
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
