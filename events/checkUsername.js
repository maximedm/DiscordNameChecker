const Sequelize = require('sequelize');
const compare = require('../functions/compareNames');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const StaffMemberModel = require('../models/StaffMember');
const StaffMember = StaffMemberModel(sequelize, Sequelize);

module.exports = {
	name: 'userUpdate',
	async execute(oldMember, newMember) {
		await sequelize.sync();
		const staffMember = await StaffMember.findOne({ where: { user_id: newMember.id } });
		if (staffMember != null) {
			await sequelize.sync();
			staffMember.update({
				username: newMember.username,
			});
			return;
		}
		try {
			if (oldMember.username !== newMember.username) {
				console.log('userUpdate', oldMember, newMember);
				compare.compareNames(newMember);
			}
		}
		catch (err) {
			console.log(err);
		}

	},
};