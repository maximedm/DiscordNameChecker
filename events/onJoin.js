const compare = require('../functions/compareNames');

module.exports = {
	name: 'guildMemberAdd',
	async execute(member) {
		compare.compareNames(member);
	},
};