const {
	insertDepartment,
	getDepartments,
	deleteDepartment,
} = require("../DB/queries");

//CRUD resolvers owner
const create_department = (args, req) => {
	if (req.token_data.role === "owner")
		return insertDepartment(args.department)
			.then((res) => res.ops[0]._id)
			.catch((err) => err);
	else throw "access denied for " + req.token_data.role;
};

const read_departments = (args, req) => {
	if (req.token_data.role === "owner") return getDepartments();
	else throw "access denied for " + req.token_data.role;
};

const delete_department = (args, req) => {
	if (req.token_data.role === "owner")
		return deleteDepartment(args._id).then((res) => res.result.n);
	else throw "access denied for " + req.token_data.role;
};

const resolver = (req) => ({
	createDepartment: (args) => create_department(args, req),
	readDepartments: (args) => read_departments(args, req),
	deleteDepartment: (args) => delete_department(args, req),
});

module.exports = { resolver };
