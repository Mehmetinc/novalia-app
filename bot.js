
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => {
  console.log(`✅ Discord bot giriş yaptı: ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() === "/merhaba") {
    message.channel.send("Merhaba! 👋 Novalia destek hattına hoş geldiniz.");
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
