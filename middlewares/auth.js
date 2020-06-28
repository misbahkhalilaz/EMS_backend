const verifyBasic = require("./auth_helpers").verifyBasic;
const verifyToken = require("./auth_helpers").verifyToken;

const auth = (req, res, next) => {
	if (req.headers.role && req.headers.authorization) {
		let auth_header = req.headers.authorization.split(" ");
		if (auth_header[0] === "Basic") {
			verifyBasic(req, res, auth_header[1]);
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
