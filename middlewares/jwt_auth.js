const jwt = require("jsonwebtoken");
const getUser = require("../DB/queries").queryUser;
const JWT_KEY = "secretkey";

const auth = (req, res, next) => {
	if (req.headers.role && req.headers.authorization) {
		let auth_header = req.headers.authorization.split(" ");
		if (auth_header[0] === "Basic") {
			let credentials = Buffer.from(auth_header[1], "base64")
				.toString("ascii")
				.split(":");
			if (req.headers.role === "owner") {
				getUser("owner", { userid: credentials[0] }, { _id: 0 })
					.then((resolve) => {
						console.log(resolve[0]);
						if (
							resolve &&
							credentials[0] === resolve[0].userid &&
							credentials[1] === resolve[0].password
						) {
							let token = jwt.sign(
								{ name: resolve[0].name, role: "owner" },
								JWT_KEY,
								{
									expiresIn: "24h",
								}
							);
							res.json(token);
						} else res.json("bad credentials");
					})
					.catch((reject) => {
						console.log(reject);
					});
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

const authenticator = () => {};

module.exports = { auth };
