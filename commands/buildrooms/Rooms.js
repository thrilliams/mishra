const { Command } = require('discord.js-commando');

module.exports = class Rooms extends Command {
    constructor(client) {
        super(client, {
            name: 'rooms',
            group: 'buildrooms',
            memberName: 'get',
            aliases: ['getrooms'],
            description: 'Displays all build rooms.'
        });
    }

    async run(msg, args) {
        let rooms = msg.guild.settings.get('rooms', {});
        if (Object.keys(rooms).length === 0 && rooms)
            return msg.channel.send(`No build rooms exist on this server!`);

        let strs = [];
        for (let room of Object.keys(rooms)) strs.push(`${msg.guild.channels.resolve(room)}`);
        strs = strs.sort().map((e, i) => `${i !== 0 && i === strs.length - 1 ? 'and ' : ''}${e}`).join(strs.length !== 2 ? ', ' : ' ');
        return msg.channel.send(`The build rooms for this server are ${strs}.`);
    }
};
