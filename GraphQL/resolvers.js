const hello = (req) => {
	console.log(req);
	return "hi";
};

const employee_resolver = (req) => ({
	hello: () => hello(req.token_data),
});

const owner_resolver = (req) => ({
	hello: () => hello(req.token_data),
});

const department_resolver = (req) => ({
	hello: () => hello(req.token_data),
});

module.exports = { employee_resolver, owner_resolver, department_resolver };
