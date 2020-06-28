const MongoClient = require("mongodb").MongoClient;

let queryUser = (collection_name, query, filter, mapcallback) => {
	const uri =
		"mongodb+srv://mkaz:0438839@cluster0-ms8de.mongodb.net/EMS?retryWrites=true&w=majority";
	const client = new MongoClient(uri, { useNewUrlParser: true });
	return new Promise((resolve, reject) => {
		client.connect((err) => {
			const collection = client.db("EMS").collection(collection_name);
			resolve(collection.find(query).project(filter).toArray());
			client.close();
			if (err) throw err;
		});
	}).then((res) => {
		return res.map(mapcallback)[0];
	});
};

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

module.exports = { queryUser };
