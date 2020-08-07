const express = require("express");
const app = express();
const CronJob = require("cron").CronJob;
const auth = require("./middlewares/auth").auth;
const express_graphql = require("express-graphql");
const { schema } = require("./GraphQL/schema");
const { resolver } = require("./GraphQL/resolvers");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const server = require("http").createServer(app);

const io = require("socket.io")(server);

const uri =
	"mongodb+srv://mkaz:0438839@cluster0-ms8de.mongodb.net/EMS?retryWrites=true&w=majority";

let queryDB = (collection_name, query_expression) => {
	return new Promise((resolve) => {
		const client = new MongoClient(uri, { useNewUrlParser: true });
		client.connect((err) => {
			const collection = client.db("EMS").collection(collection_name);
			resolve(query_expression(collection));
			client.close();
			if (err) throw err;
		});
	});
};

io.on("connection", (socket) => {
	socket.on("join", (room) => {
		socket.join(room);
		io.to(room).emit("joined", room);
		socket.on("msg", (msg) => {
			io.to(room).emit("message", msg);
		});
	});
});

let getIds = () =>
	queryDB("employee", (collection) =>
		collection.find({}).project({ _id: 1, job_id: 1 }).toArray()
	);

let getPenalty = () =>
	queryDB("jobs", (collection) =>
		collection.find({}).project({ _id: 1, abs_charges: 1 }).toArray()
	);

const job = new CronJob("00 00 00 * * 1-5", function () {
	getIds()
		.then((res) => res)
		.then((res) =>
			res.map((id) => ({
				employee_id: id._id,
				job_id: id.job_id,
				date:
					parseInt((new Date(Date.now()).getTime() / 1000).toFixed(0)) +
					5 * 3600,
				entry_time: null,
				present: false,
				leave: false,
			}))
		)
		.then((atd) =>
			getPenalty()
				.then((res) => res.map((job) => ({ [job._id]: job.abs_charges })))
				.then((res) => {
					let penalties = {};
					for (obj in res) penalties = Object.assign({}, penalties, res[obj]);
					return penalties;
				})
				.then((res) => {
					return atd.map((atd) =>
						Object.assign({}, atd, { penalty: res[atd.job_id] })
					);
				})
				.then((res) =>
					queryDB("attendance", (collection) => collection.insertMany(res))
				)
				.then(() => console.log("atd inserted for today"))
		)
		.catch((err) => console.log(err));
});

job.start();

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

server.listen(4000, () => {
	console.log("port = 4000");
});
