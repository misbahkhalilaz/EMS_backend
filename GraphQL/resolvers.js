const {
	insertEmployee,
	insertJob,
	insertProject,
	getJobs,
	getEmployees,
	getProjects,
	getTodaysAtd,
	getMonthlyAtd,
	markLeave,
	updateJob,
} = require("../DB/queries");

let create_employee = (args, req) => {
	if (req.token_data.role === "department") {
		return insertEmployee(args.employee).then((res) => res.result.n);
	} else throw "access denied for " + req.token_data.role;
};

let create_job = (args, req) => {
	if (req.token_data.role === "department") {
		return insertJob(args.job).then((res) => res.result.n);
	} else throw "access denied for " + req.token_data.role;
};

let create_project = (args, req) => {
	if (req.token_data.role === "department") {
		return insertProject(args.project).then((res) => res.result.n);
	} else throw "access denied for " + req.token_data.role;
};

let read_jobs = (args, req) => {
	if (req.token_data.role === "department") {
		return getJobs();
	} else throw "access denied for " + req.token_data.role;
};

let read_employees = (args, req) => {
	if (req.token_data.role === "department") {
		return getEmployees();
	} else throw "access denied for " + req.token_data.role;
};

let read_projects = (args, req) => {
	if (req.token_data.role === "department") {
		return getProjects();
	} else throw "access denied for " + req.token_data.role;
};

let read_daily_atd = (args, req) => {
	if (req.token_data.role === "department") {
		return getTodaysAtd();
	} else throw "access denied for " + req.token_data.role;
};

let read_monthly_atd = (args, req) => {
	if (req.token_data.role === "department") {
		return getMonthlyAtd(args.month, args.year);
	} else throw "access denied for " + req.token_data.role;
};

let mark_leave = (args, req) => {
	if (req.token_data.role === "department") {
		return markLeave(args.id).then((res) => res.result.n);
	} else throw "access denied for " + req.token_data.role;
};

let update_job = (args, req) => {
	if (req.token_data.role === "department") {
		return updateJob(args.job).then((res) => res.result.n);
	} else throw "access denied for " + req.token_data.role;
};

const resolver = (req) => ({
	createEmployee: (args) => create_employee(args, req),
	createJob: (args) => create_job(args, req),
	createProject: (args) => create_project(args, req),
	readJobs: (args) => read_jobs(args, req),
	readEmployees: (args) => read_employees(args, req),
	readProjects: (args) => read_projects(args, req),
	readDailyAtd: (args) => read_daily_atd(args, req),
	readMonthlyAtd: (args) => read_monthly_atd(args, req),
	markLeave: (args) => mark_leave(args, req),
	updateJob: (args) => update_job(args, req),
});

module.exports = { resolver };
