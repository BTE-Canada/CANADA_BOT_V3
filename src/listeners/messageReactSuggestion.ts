import Discord, { TextChannel, MessageReaction } from 'discord.js';
import { Config } from "./config";
const client = new Discord.Client();

// channel ID
const channelId = 'YOUR_CHANNEL_ID_HERE';

client.on('messageCreate', async (message) => {
  if (message.channel.id === channelId) {
    await message.react('👍');
  }
});

client.login(client.config.app.token);
