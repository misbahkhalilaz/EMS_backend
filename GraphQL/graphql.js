const { schema, owner_schema } = require("./schema");
const {
	employee_resolver,
	department_resolver,
	owner_resolver,
} = require("./resolvers");

const owner_gql = (req) => ({
	schema: owner_schema,
	rootValue: owner_resolver(req),
	graphiql: false,
});

const employee_gql = (req) => ({
	schema,
	rootValue: employee_resolver(req),
	graphiql: false,
});

const department_gql = (req) => ({
	schema,
	rootValue: department_resolver(req),
	graphiql: false,
});

module.exports = { owner_gql, department_gql, employee_gql };
