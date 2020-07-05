const {
	insertDepartment,
	getDepartments,
	updateDepartment,
	deleteDepartment,
} = require("../DB/queries");

//CRUD resolvers owner
const create_department = (args, req) => {
	if (req.token_data.role === "owner")
		return insertDepartment(args.department)
			.then((res) => res.result.n)
			.catch((err) => err);
	else throw "access denied for " + req.token_data.role;
};

const read_departments = (args, req) => {
	if (req.token_data.role === "owner")
		return getDepartments().catch((err) => err);
	else throw "access denied for " + req.token_data.role;
};

const update_department = (args, req) => {
	if (req.token_data.role === "owner")
		return updateDepartment(args._id, args.department)
			.then((res) => res.result.n)
			.catch((err) => err);
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
	updateDepartment: (args) => update_department(args, req),
	deleteDepartment: (args) => delete_department(args, req),
});

module.exports = { resolver };
