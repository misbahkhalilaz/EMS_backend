const jwt = require("jsonwebtoken");
const getUser = require("../DB/queries").queryUser;
const JWT_KEY = ",djgiopsezfljfglkzhjgfoiedrgtliewherog";

const auth = (req, res, next) => {
	if (req.headers.role && req.headers.authorization) {
		let auth_header = req.headers.authorization.split(" ");
		if (auth_header[0] === "Basic") {
			let credentials = Buffer.from(auth_header[1], "base64")
				.toString("ascii")
				.split(":");
			if (["owner", "employee", "department"].includes(req.headers.role)) {
				sendToken(res, req.headers.role, credentials);
			} else res.json("select role as: employee, owner or department");
		}
		if (auth_header[0] === "Bearer") {
			verifyToken(auth_header[1], req, res, next);
		}
	} else {
		res.json(
			"request header should contain {role, authorization: Basic or Bearer Token} fields"
		);
	}
};

const verifyToken = (token, req, res, next) => {
	jwt.verify(token, JWT_KEY, (err, decoded) => {
		if (err) {
			res.json(err.message);
		} else if (["owner", "department", "employee"].includes(decoded.role)) {
			req.token_data = decoded;
			next();
		}
	});
};

const genToken = (res, collection, credentials, query, filter, map) => {
	getUser(collection, query, filter, map)
		.then((user) => {
			console.log(user);
			if (
				user &&
				credentials[0] === user.userid &&
				credentials[1] === user.password
			) {
				let token = jwt.sign(
					{
						userid: user.userid,
						name: user.name,
						role: "owner",
					},
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
};

const sendToken = (res, role, credentials) => {
	if (role === "owner")
		genToken(
			res,
			"owner",
			credentials,
			{ userid: credentials[0] },
			{ _id: 0 },
			(user) => user
		);
	if (role === "employee") console.log("triggered employee");
	if (role === "department") console.log("triggered department");
};

module.exports = { auth };
