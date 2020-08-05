const express = require("express");
const app = express();
// const CronJob = require("cron").CronJob;
const auth = require("./middlewares/auth").auth;
const express_graphql = require("express-graphql");
const { schema } = require("./GraphQL/schema");
const { resolver } = require("./GraphQL/resolvers");
const cors = require("cors");

// let job = new CronJob(
//   "*/10 * * * * *",
//   () => console.log("hi"),
//   null,
//   false,
//   "Asia/Karachi"
// );

// job.start();

app.use(cors());

app.use(express.json(), auth);

app.use(
	"/",
	(() =>
		express_graphql((req) => ({
			schema,
			rootValue: resolver(req),
			graphiql: false,
		})))()
);

app.listen(4000, () => {
	console.log("port = 4000");
});
