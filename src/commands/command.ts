import { ChatInputApplicationCommandData, CommandInteraction } from 'discord.js';
import { MyClient } from '../index';

export interface Command extends ChatInputApplicationCommandData {
    run: (client: MyClient, interaction: CommandInteraction) => void;
}