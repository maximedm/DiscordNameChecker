const { Client, Intents } = require('discord.js');
const { token, logChannel, serverId } = require('./config.json');
const fs = require('fs');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });


const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(token);

module.exports.sendmessage = async function(message) {
	return await client.channels.cache.get(logChannel).send(message);
};

module.exports.senddm = async function(user_id, message) {
	return await client.users.cache.get(user_id).send(message);
};

module.exports.banuser = async function(user) {
	return await client.guilds.cache.find(serverId).members.ban(user);
};