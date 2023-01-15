import { ApplicationCommandType, CommandInteraction } from 'discord.js';
import { Command } from '../command';
import { MyClient } from 'src';

export const IP: Command = {
    name: "ip",
    description: "Sends our server IP in chat.",
    type: ApplicationCommandType.ChatInput,
    run: async (client: MyClient, interaction: CommandInteraction) => {
        await interaction.reply('Our server IP is **btecanada.net**! It currently runs on **1.12.2**. Make sure to download the modpack for a better experience!')
    }
}