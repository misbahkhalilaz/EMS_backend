const { verifyBasic, verifyToken } = require("./auth_helpers");

const auth = (req, res, next) => {
	if (req.headers.authorization) {
		let auth_header = req.headers.authorization.split(" ");
		if (auth_header[0] === "Basic") {
			if (req.headers.role) verifyBasic(req, res, auth_header[1]);
			else res.json("add role to the req header");
		}
		if (auth_header[0] === "Bearer") {
			verifyToken(req, res, next, auth_header[1]);
		}
	} else {
		res.json(
			"request header should contain {role, authorization: Basic or Bearer Token} fields"
		);
	}
};

module.exports = { auth };
