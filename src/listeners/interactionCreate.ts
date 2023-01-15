import { CommandInteraction, Interaction } from 'discord.js';
import { Commands } from '../commands/commands';
import { MyClient } from '../index';

export default (client: MyClient): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            await handleSlashCommand(client, interaction);
        }
    })
}

const handleSlashCommand = async (client: MyClient, interaction: CommandInteraction): Promise<void> => {
    const slashCommand = Commands.find(c => c.name === interaction.commandName);
    
    /*if (!slashCommand) {
        interaction.followUp({ content: "An error as occurred"});
        return;
    }*/

    //await interaction.deferReply();

    slashCommand!.run(client, interaction);
}