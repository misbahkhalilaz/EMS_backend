const hello = (req) => {
	console.log(req);
	return "hi";
};

const add_department = (req) => {
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
	hello: () => hello(req.token_data),
	addDepartment: () => add_department(req),
});

const department_resolver = (req) => ({
	hello: () => hello(req.token_data),
});

module.exports = { employee_resolver, owner_resolver, department_resolver };
