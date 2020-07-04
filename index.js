const express = require("express");
const app = express();
const auth = require("./middlewares/auth").auth;
const express_graphql = require("express-graphql");
const {
	owner_gql,
	employee_gql,
	department_gql,
} = require("./GraphQL/graphql");

const checkAccess = (req, res, next, role) => {
	role.includes(req.token_data.role)
		? next()
		: res.json("unauthorized access. Use path /" + req.token_data.role);
};

app.use(express.json(), auth);

app.use(
	"/owner",
	(req, res, next) => checkAccess(req, res, next, ["owner"]),
	express_graphql((req) => owner_gql(req))
);

app.use(
	"/department",
	(req, res, next) => checkAccess(req, res, next, ["department"]),
	express_graphql((req) => department_gql(req))
);

app.use(
	"/employee",
	(req, res, next) => checkAccess(req, res, next, ["employee"]),
	express_graphql((req) => employee_gql(req))
);

app.listen(4000, () => {
	console.log("port = 4000");
});
