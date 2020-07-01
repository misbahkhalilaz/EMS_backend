const express = require("express");
const app = express();
const auth = require("./middlewares/auth").auth;
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

app.use(express.json(), auth, (req, res, next) => {
	console.log(req.token_data);
	next();
});

app.get("/", (req, res) => {
	res.json("please use /" + req.token_data.role + " route");
});

app.get(
	"/owner",
	(req, res, next) => checkAccess(req, res, next, ["owner"]),
	owner_gql
);

app.get(
	"/employee",
	(req, res, next) => checkAccess(req, res, next, ["employee"]),
	employee_gql
);

app.get(
	"/department",
	(req, res, next) => checkAccess(req, res, next, ["department"]),
	department_gql
);

app.listen(4000, () => {
	console.log("port = 4000");
});
