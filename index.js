require('dotenv').config();

const { 
    Client, 
    GatewayIntentBits 
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`🚔 SSP BOT ONLINE: ${client.user.tag}`);
});

client.login(process.env.TOKEN);