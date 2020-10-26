const brackets = require('g2-bracket-parser');

function resolveUrl(client, url) {
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

function resolveEmoji(client, emojiname, guildid = '770141899624546324') { // guild id here is the id of Mishra's emoji storage, this needs to be changed for forks
    if (!client || !emojiname) return false;
    emojiname = emojiname.toLowerCase();
    let guild = client.guilds.resolve(guildid);
    if (!guild) return false;
    return guild.emojis.cache.find(e => e.name === emojiname);
}

function parseMana(client, cost, guildid = '770141899624546324') {
    symbols = cost.split(/((?<={).\/.(?=})|[WUBRGXYZ]|\d{1,})/g).map(e => 'mana' + e.replace('/', ''));

    symbols = symbols.map(e => {
        let emoji = resolveEmoji(client, e, guildid);
        if (emoji === false) e = e.split('').reverse().join('');
        emoji = resolveEmoji(client, e, guildid);
        if (emoji === false) console.log(`A manamoji broke: ${e}`);
        return emoji;
    });

    return symbols.join('');
}

function parseText(client, text, guildid = '770141899624546324') {
    let symbols = brackets(text, {
        brackets: {
            '{': { start: '{', end: '}', length: 1 }
        }
    });
    for (let symbol of symbols) {
        text = text.replace(symbol.content, resolveEmoji(client, 'mana' + symbol.match.content.replace('/', ''), guildid));
    }
    text = text.split('\n').map(e => e.trim()).join('\n');
    return text;
}

module.exports = {
    resolveUrl: resolveUrl,
    resolveEmoji: resolveEmoji,
    parseMana: parseMana,
    parseText: parseText
}