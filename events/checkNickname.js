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
	name: 'guildMemberUpdate',
	async execute(oldMember, newMember) {
		await sequelize.sync();
		const staffMember = await StaffMember.findOne({ where: { user_id: newMember.id } });
		if (staffMember != null) {
			console.log('This is a staff member, just updating');
			await sequelize.sync();
			staffMember.update({
				username: newMember.user.username,
			});
			return;
		}

		console.log('guildMemberUpdate', oldMember.nickname, newMember.nickname);
		compare.compareNames(newMember.user);
	},
};