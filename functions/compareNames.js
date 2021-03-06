const FuzzyMatching = require('fuzzy-matching');
const Sequelize = require('sequelize');
const index = require('../index.js');
const moment = require('moment');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const StaffMemberModel = require('../models/StaffMember');
const StaffMember = StaffMemberModel(sequelize, Sequelize);

module.exports.compareNames = async function(user) {
	const fuzzyArray = [];
	await sequelize.sync();
	const staffMembers = await StaffMember.findAll({ raw: true });
	staffMembers.forEach(staffMember => {
		fuzzyArray.push(staffMember.username);
	});


	const fm = new FuzzyMatching(fuzzyArray);
	const userCheck = fm.get(user.username);
	console.log('CompareNames', userCheck);
	if (userCheck.distance > 0) {
		if (userCheck.distance > 0.6) {
			if (userCheck.distance > 0.8) {
				console.log(user.username + 'Is definetly copying staff member name.');
				index.sendmessage('@here <@' + user.id + '> (' + user.username + ') Is definetly copying staff member name of ' + userCheck.value + ' [ **' + (userCheck.distance * 100).toFixed(2) + '% match** ] <t:' + moment().unix() + '>');
				index.senddm(user.id, 'Please change your username it is close to impersonating our staff members. [ **' + (userCheck.distance * 100).toFixed(2) + '% match** ] with the name of ' + userCheck.value);
				// index.banuser(user);
			}
			else {
				console.log(user.username + 'Is most likely copying staff member name.');
				index.senddm(user.id, 'Please change your username it is close to impersonating our staff members. [ **' + (userCheck.distance * 100).toFixed(2) + '% match** ] with the name of ' + userCheck.value);
				index.sendmessage('@here <@' + user.id + '> (' + user.username + ') Is most likely copying staff member name of ' + userCheck.value + ' [ **' + (userCheck.distance * 100).toFixed(2) + '% match** ] <t:' + moment().unix() + '>');
			}
		}
		else {
			console.log(user.username + ' Might copy a staff member name.');
		}
	}
	else {
		console.log(user.username + ' no staff name.');
	}
};