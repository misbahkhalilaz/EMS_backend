const mw = (req, res, next) => {
	console.log("accessed: " + req.path);
	// res.redirect("../login");
	// if (res.path !== "/login") next();
	next();
};

module.exports = { mw };

const jwt = require("jsonwebtoken");

let token = jwt.sign({ user: "admin" }, "mkaz", { expiresIn: "1s" });

console.log(token);

console.log(jwt.verify(token, "mkaz"));

module.exports = { token };
