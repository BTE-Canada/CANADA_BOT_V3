import { ApplicationCommandType, CommandInteraction } from 'discord.js';
import { Command } from '../command';
import { MyClient } from 'src';

export const Baby: Command = {
    name: "baby",
    description: "baby",
    type: ApplicationCommandType.ChatInput,
    run: async (client: MyClient, interaction: CommandInteraction) => {
        await interaction.reply('https://media.discordapp.net/attachments/749820367056535552/850441829119950858/Dil.jpg');
    }
}