const { buildSchema } = require("graphql");

const schema = buildSchema(`
		type Query {
			readDepartments: [department]
			readJobs: [job]
		}

		type Mutation {
			createEmployee(employee: Employee!): Int
			createJob(job: Job!): Int
			createProject(project: Project!): Int
		}

		input Employee {
			_id: String!,
			did: String!,
			job_id: String!,
			first_name: String!,
			last_name: String,
			mobile: String!,
			email: String!,
			address: String!,
			joining_date: Int!,
			password: String!
		}

		input Job {
			_id: String!,
			title: String!,
			pay: Int!,
			start_time: String!,
			exit_time: String!,
			late_charges: Int!,
			abs_charges: Int!,
			fixed_allowances: [Allowance]
		}

		type job {
			_id: String!,
			title: String!,
			pay: Int!,
			start_time: String!,
			exit_time: String!,
			late_charges: Int!,
			abs_charges: Int!,
			fixed_allowances: [allowance]
		}

		input Allowance {
			title: String!,
			month: Int,
			amount: Int
		}

		type allowance {
			title: String!,
			month: Int,
			amount: Int
		}

		input Project {
			title: String!,
			posted_date: String!,
			deadline: String,
			leading_member: String!,
			other_members: [String]
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
