const MongoClient = require("mongodb").MongoClient;

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

let queryUser = (collection_name, query, filter, mapcallback) =>
	queryDB(collection_name, (collection) =>
		collection.find(query).project(filter).toArray()
	).then((res) => {
		return res.map(mapcallback)[0];
	});

//CRUD dpadmin
let insertEmployee = (employee) =>
	queryDB("employee", (collection) =>
		collection.insertOne({ ...employee, chat_admin: [] })
	);

let insertJob = (job) =>
	queryDB("jobs", (collection) => collection.insertOne(job));

let insertProject = (proj) =>
	queryDB("projects", (collection) =>
		collection.insertOne({ ...proj, completed: false, tasks: [], chat: [] })
	);

let getJobs = () =>
	queryDB("jobs", (collection) => collection.find({}).toArray());

let getEmployees = () =>
	queryDB("employee", (collection) => collection.find({}).toArray());

let getProjects = () =>
	queryDB("projects", (collection) => collection.find({}).toArray());

let getTodaysAtd = () =>
	queryDB("attendance", (collection) =>
		collection
			.find({
				date: {
					$gt:
						parseInt((new Date(Date.now()).getTime() / 1000).toFixed(0)) -
						19 * 3600,
				},
			})
			.toArray()
	);

let getMonthlyAtd = (month, year) =>
	queryDB("attendance", (collection) =>
		collection
			.find({
				$and: [
					{
						date: {
							$gte:
								parseInt(
									(
										new Date(month.toString() + "/1/" + year).getTime() / 1000
									).toFixed(0)
								) +
								5 * 3600,
						},
					},
					{
						date: {
							$lt:
								parseInt(
									(
										new Date(
											(month + 1).toString() + "/1/" + year.toString()
										).getTime() / 1000
									).toFixed(0)
								) -
								19 * 3600,
						},
					},
				],
			})
			.toArray()
	);

let markLeave = (id) =>
	queryDB("attendance", (collection) =>
		collection.updateOne(
			{
				$and: [
					{
						date: {
							$gt:
								parseInt((new Date(Date.now()).getTime() / 1000).toFixed(0)) -
								19 * 3600,
						},
					},
					{ employee_id: id },
				],
			},
			{ $set: { leave: true, penalty: 0 } }
		)
	);

let updateJob = (job) =>
	queryDB("jobs", (collection) =>
		collection.updateOne({ _id: job._id }, { $set: { ...job } })
	);

module.exports = {
	queryDB,
	queryUser,
	insertEmployee,
	insertJob,
	insertProject,
	getJobs,
	getEmployees,
	getProjects,
	getTodaysAtd,
	getMonthlyAtd,
	markLeave,
	updateJob,
};
