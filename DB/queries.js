const MongoClient = require("mongodb").MongoClient;

let queryUser = (collection_name, query, filter) => {
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
	});
};

// queryUser("owner", { name: "Misbah" }, { _id: 0 }).then((res, rej) => {
// 	console.log(res[0]);
// });

module.exports = { queryUser };
