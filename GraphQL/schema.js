const { buildSchema } = require("graphql");

const schema = buildSchema(`
type Query {
    test: String!
}

type user {
    userid: String!
    name: String!
    role: String!
}
`);

module.exports = { schema };
