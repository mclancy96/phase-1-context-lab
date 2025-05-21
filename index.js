function createEmployeeRecord(employeeInfo) {
	return {
		firstName: employeeInfo[0],
		familyName: employeeInfo[1],
		title: employeeInfo[2],
		payPerHour: employeeInfo[3],
		timeInEvents: [],
		timeOutEvents: []
	}
}

function createEmployeeRecords(employeeInfoArray) {
	return employeeInfoArray.map(employeeInfo => createEmployeeRecord(employeeInfo))
}

function createTimeInEvent(timePunch) {
	this.timeInEvents.push(parseTimePunch(timePunch, "TimeIn"))
	return this
}

function createTimeOutEvent(timePunch) {
	this.timeOutEvents.push(parseTimePunch(timePunch, "TimeOut"))
	return this
}

function parseTimePunch(timePunchString, type) {
	const timePunchFormat = /^\d{4}-\d{2}-\d{2} \d{4}$/;
	if (!timePunchFormat.test(timePunchString)) {
		throw new Error("Time punch format must be 'YYYY-MM-DD HHMM'");
	}
	return {
		type: type,
		hour: Number.parseInt(timePunchString.split(' ')[1]),
		date: timePunchString.split(' ')[0]
	}
}

function getDuration(timeInTime, timeOutTime) {
	const timeInHour = Math.floor(timeInTime / 100);
	const timeInMinutes = Number.parseInt(timeInTime.toString().slice(-2)) / 60;
	const timeOutHour = Math.floor(timeOutTime / 100);
	const timeOutMinutes = Number.parseInt(timeOutTime.toString().slice(-2)) / 60;
	return (timeOutHour + timeOutMinutes) - (timeInHour + timeInMinutes)
}
function hoursWorkedOnDate(dateWorked) {
	const timeInTime = this.timeInEvents.find(event => event.date === dateWorked).hour;
	const timeOutTime = this.timeOutEvents.find(event => event.date === dateWorked).hour;
	if (!timeInTime || !timeOutTime) throw new Error("Missing punch detected");
	return getDuration(timeInTime, timeOutTime)
}

function wagesEarnedOnDate(dateWorked) { return this.payPerHour * hoursWorkedOnDate.call(this, dateWorked) }

function findEmployeeByFirstName(collection, firstNameString) {
	return collection.find(record => record.firstName === firstNameString)
}

/*
 We're giving you this function. Take a look at it, you might see some usage
 that's new and different. That's because we're avoiding a well-known, but
 sneaky bug that we'll cover in the next few lessons!

 As a result, the lessons for this function will pass *and* it will be available
 for you to use if you need it!
 */

const allWagesFor = function () {
	const eligibleDates = this.timeInEvents.map(function (e) {
		return e.date
	})

	const payable = eligibleDates.reduce(function (memo, d) {
		return memo + wagesEarnedOnDate.call(this, d)
	}.bind(this), 0) // <== Hm, why did we need to add bind() there? We'll discuss soon!

	return payable
}


function calculatePayroll(employeeRecords) { return employeeRecords.reduce((total, record) => total + allWagesFor.call(record), 0) }
