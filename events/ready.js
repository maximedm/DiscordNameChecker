const Sequelize = require('sequelize');
const { staffRoles, serverId } = require('../config.json');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const StaffMemberModel = require('../models/StaffMember');
const StaffMember = StaffMemberModel(sequelize, Sequelize);

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		// Checking all users with staff roles.
		client.guilds.cache.get(serverId).fetch().then((guild) => {
			guild.members.fetch().then((members) => {
				members.forEach(async (member) => {
					if (member.roles.cache.some(role => staffRoles.includes(role.id))) {
						console.log(member.user.username);
						await sequelize.sync();
						await StaffMember.upsert({
							user_id: member.user.id,
							username: member.user.username,
						});
					}
				});
			});
		});
	},
};