const jwt = require("jsonwebtoken");
const JWT_KEY = "secretkey";

const auth = (req, res, next) => {
	if (req.headers.role && req.headers.authorization) {
		let auth_header = req.headers.authorization.split(" ");
		if (auth_header[0] === "Basic") {
			let credentials = Buffer.from(auth_header[1], "base64")
				.toString("ascii")
				.split(":");
			if (credentials[0] === "mkaz" && credentials[1] === "0438839") {
				let token = jwt.sign(
					{ role: req.headers.role, user: credentials[0] },
					JWT_KEY,
					{ expiresIn: "24s" }
				);
				res.json(token);
			} else {
				res.json("bad credentials");
			}
		}
		if (auth_header[0] === "Bearer") {
			jwt.verify(auth_header[1], JWT_KEY, (err, decoded) => {
				if (err) {
					res.json(err.message);
				} else if (decoded.role === "admin") {
					next();
				}
			});
		}
	} else {
		res.json(
			"request header should contain {role, authorization: Basic or Bearer Token} fields"
		);
	}
};

module.exports = { auth };
