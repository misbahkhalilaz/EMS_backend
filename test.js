const MongoClient = require("mongodb").MongoClient;
const uri =
	"mongodb+srv://mkaz:0438839@cluster0-ms8de.mongodb.net/EMS?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect((err) => {
	const collection = client.db("EMS").collection("owner");
	collection.find({}).toArray(function (err, result) {
		if (err) throw err;
		console.log(result);
		client.close();
	});
	//client.close();
});
