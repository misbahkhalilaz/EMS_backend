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
    collection.insertOne({ ...proj, tasks: [], chat: [] })
  );

let getJobs = () =>
  queryDB("jobs", (collection) => collection.find({}).toArray());

let getEmployees = () =>
  queryDB("employee", (collection) => collection.find({}).toArray());

// CRUD owner

// let insertDepartment = (department) =>
// 	queryDB("department", (collection) => collection.insertOne(department));

// let getDepartments = () =>
// 	queryDB("department", (collection) => collection.find().toArray());

// let updateDepartment = (_id, department) =>
// 	queryDB("department", (collection) =>
// 		collection.replaceOne({ _id }, department)
// 	);
// let deleteDepartment = (_id) =>
// 	queryDB("department", (collection) => collection.remove({ _id }));

// deleteDepartment("admin").then((res) => console.log(res));

// insertDepartment({ id: 2431 });

// queryUser(
// 	"department",
// 	{ "admins.userid": "dpadmin" },
// 	{ _id: 0, admins: 1 },
// 	(user) => {
// 		return {
// 			name: user.admins[0].name,
// 			userid: user.admins[0].userid,
// 			password: user.admins[0].password,
// 		};
// 	}
// )
// 	.then((res, rej) => {
// 		console.log(res);
// 	})
// 	.catch((err) => console.log(err));

module.exports = {
  queryUser,
  insertEmployee,
  insertJob,
  insertProject,
  getJobs,
  getEmployees,
  //   insertDepartment,
  //   getDepartments,
  //   updateDepartment,
  //   deleteDepartment,
};
