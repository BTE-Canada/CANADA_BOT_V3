import { GuildMember, Client, Channel, TextChannel, CommandInteraction, Message, User } from 'discord.js';

export class DiscordHelpers {

    public static hasRole(member: GuildMember, roleId: string): boolean {
        return member.roles.cache.has(roleId);
    }

    public static async setRole(interaction: CommandInteraction, user: User, roleId: string): Promise<boolean> {
        const member = await interaction.guild?.members.fetch(user);

        if (member) {
            if (this.hasRole(member, roleId)) return true;

            const role = interaction.guild?.roles.cache.get(roleId);

            if (role) {
                const response = await member.roles.add(role);
                return this.hasRole(response, roleId);
            }
        }

        return false;
    }

    public static async getChannel(client: Client, channelId: string): Promise<Channel | null> {
        return await client.channels.fetch(channelId);
    }

    public static async getTextChannel(client: Client, channelId: string): Promise<TextChannel | null> {
        const channel = await this.getChannel(client, channelId);

        if (channel && channel.isTextBased())
            return channel as TextChannel;
        
        return null;
    }

    public static async getMessage(client: Client, channelId: string, messageId: string): Promise<Message<true> | undefined | null>  {
        const channel = await this.getChannel(client, channelId);
        if (channel) {
            if (channel.isTextBased()) {
                console.log(channel);

                const textChannel = channel as TextChannel;
                return textChannel.messages.fetch(messageId);

            }
            return null;
        }
        return null;
    }

    

}