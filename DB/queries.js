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

let readCurrentSalaries = () =>
	queryDB("salary", (collection) =>
		collection
			.find({
				timestamp: {
					$gte: parseInt(
						(
							new Date(
								new Date(Date.now()).getMonth().toString() +
									"/28/" +
									new Date(Date.now()).getFullYear().toString()
							).getTime() / 1000
						).toFixed(0)
					),
				},
			})
			.project({ _id: 0 })
			.toArray()
	);

let getBio = (id) =>
	queryDB("employee", (collection) =>
		collection
			.find({ _id: id })
			.project({
				_id: 1,
				first_name: 1,
				last_name: 1,
				email: 1,
				joining_date: 1,
				job_id: 1,
			})
			.toArray()
	).then((res) => res[0]);

let getJob = (id) =>
	queryDB("jobs", (collection) => collection.find({ _id: id }).toArray()).then(
		(res) => res[0]
	);

let timediff = (time, timestamp) => {
	var t = time.split(":");
	return (
		-parseInt(timestamp + t[0] * 3600 + t[1] * 60).toFixed(0) +
		parseInt((new Date(Date.now()).getTime() / 1000 + 5 * 3600).toFixed(0))
	);
};

let markAtd = (id) =>
	queryDB("attendance", (collection) =>
		collection
			.find({
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
			})
			.toArray()
	)
		.then((atd) => atd[0])
		.then((atd) =>
			queryDB("jobs", (collection) =>
				collection.find({ _id: atd.job_id }).toArray()
			)
				.then((jobs) => jobs[0])
				.then((jobs) =>
					queryDB("attendance", (collection) =>
						collection.updateOne(
							{ _id: atd._id },
							{
								$set:
									atd.entry_time === null
										? {
												present:
													timediff(jobs.start_time, atd.date) < 3600
														? true
														: false,
												penalty:
													timediff(jobs.start_time, atd.date) < 15 * 60
														? 0
														: timediff(jobs.start_time, atd.date) < 3600
														? jobs.late_charges
														: jobs.abs_charges,
												entry_time: parseInt(
													(
														new Date(Date.now()).getTime() / 1000 +
														5 * 3600
													).toFixed(0)
												),
										  }
										: {},
							}
						)
					).then((res) => res.result.n)
				)
				.catch((err) => console.log(err))
		);

let getMonthlyAtdEmp = (id, month, year) =>
	getMonthlyAtd(month, year).then((res) =>
		res.filter((atd) => atd.employee_id === id)
	);

let getBroadcasts = () =>
	queryDB("broadcast", (collection) =>
		collection
			.find({
				date: {
					$gte: parseInt(new Date(Date.now()).getTime() / 1000 - 163 * 3600),
				},
			})
			.toArray()
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
	readCurrentSalaries,
	getBio,
	getJob,
	markAtd,
	getMonthlyAtdEmp,
	getBroadcasts,
};
