const { insertDepartment } = require("../DB/queries");

const hello = (args, req) => {
	console.log(req);
	return "hi";
};

const add_department = (args, req) => {
	insertDepartment(args.department)
		.then((res) => JSON.stringify(res))
		.catch((err) => JSON.stringify(err));
};

const employee_resolver = (req) => ({
	hello: () => hello(req.token_data),
});

const owner_resolver = (req) => ({
	hello: (args) => hello(args, req.token_data),
	addDepartment: (args) => add_department(args, req),
});

const department_resolver = (req) => ({
	hello: (args) => hello(args, req.token_data),
});

module.exports = { employee_resolver, owner_resolver, department_resolver };
