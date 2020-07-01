const express_graphql = require("express-graphql");
const { schema } = require("./schema");
const resolvers = require("./resolvers");

const owner_gql = express_graphql({
	schema,
	rootValue: resolvers,
	graphiql: false,
});

const employee_gql = express_graphql({
	schema,
	rootValue: resolvers,
	graphiql: false,
});

const department_gql = express_graphql({
	schema,
	rootValue: resolvers,
	graphiql: false,
});

module.exports = { owner_gql, department_gql, employee_gql };
