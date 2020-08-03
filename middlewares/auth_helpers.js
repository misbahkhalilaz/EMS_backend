const jwt = require("jsonwebtoken");
const getUser = require("../DB/queries").queryUser;
const JWT_KEY = "jho3h45lj9824hiu7yri2744gr7uyge28";

const verifyToken = (req, res, next, token) => {
  jwt.verify(token, JWT_KEY, (err, decoded) => {
    if (err) {
      res.json("token error");
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
            first_name: user.first_name,
            last_name: user.last_name,
            role: collection,
          },
          JWT_KEY,
          {
            expiresIn: "24h",
          }
        );
        res.json({
          token,
          user: {
            userid: user.userid,
            first_name: user.first_name,
            last_name: user.last_name,
            role: collection,
          },
        });
      } else res.json("bad credentials");
    })
    .catch((err) => {
      console.log(err);
      res.json("bad credentials or db err");
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
      { _id: credentials[0] },
      { _id: 1, first_name: 1, last_name: 1, password: 1 },
      (user) => {
        console.log(user);
        return {
          first_name: user.first_name,
          last_name: user.last_name,
          userid: user._id,
          password: user.password,
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
