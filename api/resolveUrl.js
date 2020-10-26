module.exports = {
    resolveUrl: function (client, url) {
        if (!url || !client) return false;
        let snowflakes = url.split('/').slice(4);
        let guild = client.guilds.resolve(snowflakes[0]);
        if (!guild) return false;
        let channel = guild.channels.resolve(snowflakes[1]);
        if (!channel) return false;
        let message = channel.messages.resolve(snowflakes[2]);
        if (!message) return false;
        return message;
    }
}