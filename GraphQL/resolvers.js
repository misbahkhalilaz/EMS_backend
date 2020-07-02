const hello = (req) => {
	console.log(req);
	return "hi";
};

const add_department = (args, req) => {
	console.log(args._id);
	console.log(req.token_data);
	return {
		_id: "id",
		name: "name",
		admins: [
			{
				name: "allibhai",
				userid: "iddd",
				password: "passs",
			},
		],
	};
};

const employee_resolver = (req) => ({
	hello: () => hello(req.token_data),
});

const owner_resolver = (req) => ({
	hello: (args) => hello(req.token_data),
	addDepartment: (args) => add_department(args, req),
});

const department_resolver = (req) => ({
	hello: () => hello(req.token_data),
});

module.exports = { employee_resolver, owner_resolver, department_resolver };
