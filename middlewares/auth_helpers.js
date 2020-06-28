const jwt = require("jsonwebtoken");
const getUser = require("../DB/queries").queryUser;
const JWT_KEY = ",djgiopsezfljfglkzhjgfoiedrgtliewherog";

const verifyToken = (req, res, next, token) => {
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
						role: collection,
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
	if (role === "employee")
		genToken(
			res,
			"employee",
			credentials,
			{ "credentials.userid": credentials[0] },
			{ _id: 0, name: 1, credentials: 1 },
			(user) => {
				return {
					name: user.name,
					userid: user.credentials.userid,
					password: user.credentials.password,
				};
			}
		);
	if (role === "department")
		genToken(
			res,
			"department",
			credentials,
			{ "admins.userid": credentials[0] },
			{ _id: 0, admins: 1 },
			(user) => {
				return {
					name: user.admins[0].name,
					userid: user.admins[0].userid,
					password: user.admins[0].password,
				};
			}
		);
};

const verifyBasic = (req, res, auth_header) => {
	let credentials = Buffer.from(auth_header, "base64")
		.toString("ascii")
		.split(":");
	if (["owner", "employee", "department"].includes(req.headers.role)) {
		sendToken(res, req.headers.role, credentials);
	} else res.json("select role as: employee, owner or department");
};

module.exports = { verifyBasic, verifyToken };
