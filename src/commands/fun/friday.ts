import { ApplicationCommandType, CommandInteraction } from 'discord.js';
import { Command } from '../command';
import { MyClient } from 'src';

export const Friday: Command = {
    name: "friyay",
    description: "Is it friday????",
    type: ApplicationCommandType.ChatInput,
    run: async (client: MyClient, interaction: CommandInteraction) => {
        const date = new Date();
        const day = date.getDay();

        if (day === 5) {
            return await interaction.reply(`
            OMG OMG OMG OMG OMG OMG OMG OMG!!!! :scream_cat:
            IT'S ***FRIDAY***!!!!!!!!!!!!!!!!!!! YAYAYAYAYAYAYAYAYAYAY
            <@306529453826113539><@306529453826113539><@306529453826113539><@306529453826113539><@306529453826113539>
            `);
        }

        const dayName = date.toLocaleString('en-us', { weekday: 'long' });
        const daysLeft = day === 6 ? 6 : 5 - day;

        await interaction.reply(`:pleading_face: Sowwy, it's actually ${dayName}! There's still *${daysLeft} days* left before Friday 😦`);
    }
}