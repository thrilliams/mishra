const { Command } = require('discord.js-commando');

module.exports = class UnsetRoom extends Command {
    constructor(client) {
        super(client, {
            name: 'clearrooms',
            group: 'buildrooms',
            memberName: 'clear',
            description: 'Removes all build rooms.',
            userPermissions: ['MANAGE_CHANNELS']
        });
    }

    async run(msg, args) {
        let rooms = msg.guild.settings.get('rooms', {});
        if (Object.keys(rooms).length === 0)
            return msg.channel.send(`There are no build rooms to remove!`);

        msg.guild.settings.remove('rooms');
        return msg.channel.send(`All build rooms have been removed.`);
    }
};
