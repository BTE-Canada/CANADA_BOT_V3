import { ApplicationCommandType, CommandInteraction } from 'discord.js';
import { Command } from '../command';
import { MyClient } from 'src';

export const Gep: Command = {
    name: "gep",
    description: "Google Earth Pro information!",
    type: ApplicationCommandType.ChatInput,
    run: async (client: MyClient, interaction: CommandInteraction) => {
        await interaction.reply(`
        **Download:** https://www.google.com/earth/versions/download-thank-you/?usagestats=0\n\n
        **Ruler Tool (useful for measuring horizontal lengths like windows):** https://gyazo.com/d58446cec35cc504bb36b749346041a9\n\n
        **Elevation (useful for measuring vertical distances like house heights)** of where your mouse is hovering is shown in the bottom right corner. 
        Use this to measure building heights by calculating the difference in elevation between the ground and the top of a building.\n\n
        Press CTRL+SHIFT+C to automatically **copy coordinates** of where your mouse is hovering.
        `);
    }
}