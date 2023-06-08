import Discord, { ApplicationCommandOptionType, ApplicationCommandType, Channel, CommandInteraction, TextChannel, GuildMember, Message } from 'discord.js';
import { Command } from '../command';
import { MyClient } from 'src';
import { DiscordHelpers } from '../../helpers/discord-helpers';

const { EmbedBuilder } = require('discord.js');

const D = false;

export const TrialReview: Command = {
    name: "review",
    description: "Trial Review command.",
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        name: "submissionid",
        description: "Submission message ID.",
        type: ApplicationCommandOptionType.String,
        required: true
      },
      {
        name: "accept",
        description: "Accept or Deny this trial?",
        type: ApplicationCommandOptionType.Boolean,
        required: true
      },
      {
        name: "feedback",
        description: "Send this submission feedback.",
        type: ApplicationCommandOptionType.String,
        required: false
      }
    ],
    run: async (client: MyClient, interaction: CommandInteraction) => {
        
        try {

            // Verify User is Staff
            if (!DiscordHelpers.hasRole(interaction.member as GuildMember, client.config.opt.roles.staff)) {
                return await interaction.reply("You don't have permission to review trial builds!");
            }
            const reviewer = interaction.user.toString();
            
            // Get Options
            const options = interaction.options;       
            const submissionId = options.get("submissionid", true).value?.toString();
            const accept = options.get("accept", true).value as boolean;
            const feedback = options.get("feedback", false)?.value?.toString();

            if (D) console.log(`
                Options: {
                    SubmissionId: ${submissionId},
                    Accept: ${accept},
                    Feedback: ${feedback ?? ""}
                }
            `);


            // Validate SubmissionId
            if (!submissionId || isNaN(parseInt(submissionId)) || submissionId.length != 19) {
                return interaction.reply("That isn't a valid message ID! (Example: 1021270419833094214)");
            }    
            

            // Get Submission Message and Details
            const submissionMsg = await DiscordHelpers.getMessage(client, client.config.opt.channels.trial_submit, submissionId);
            if (!submissionMsg) return interaction.reply("Failed! Submit Message Not Found!");   
            const submittingMember = submissionMsg.author;
            if (!submittingMember) return interaction.reply("Failed! Submitter Invalid!");

            await interaction.reply("Processing...");
            
            if (submissionMsg.reactions.cache.has("✅")) {
                return await interaction.followUp("That one has already been reviewed!");
            }

            if (accept) {

                const embedreply1 = new EmbedBuilder()
                .setTitle(`**<a:SPINNYCANADAv2:1102005736655036426> REVIEWED SUCCESSFULLY <a:SPINNYCANADAv2:1102005736655036426>**`)
                .setDescription(`
                    You have accepted ${submittingMember.toString()}'s build!\n[Submission Link](${submissionMsg.url})
                    ${feedback != undefined ? `\nFeedback: ${feedback}` : ""}
                `)
                
                await interaction.followUp({ embeds: [embedreply1] });

                const embedaccept = new EmbedBuilder()
                    .setTitle(`<a:SPINNYCANADAv2:1102005736655036426> Your recent trial submission has been accepted! <a:SPINNYCANADAv2:1102005736655036426>`)
                    .setDescription(`
                        You have been **accepted** into our build team! Your rank is now **Novice Builder**.\n
                        You can build anywhere now as long as you follow our builder system, which can be found in our discord. Welcome aboard!\n
                        Reviewer: ${reviewer}
                        ${feedback != undefined ? `\nFeedback: ${feedback}` : ""}
                    `)
                    .setColor(0x00FF00)
            
                await submittingMember.send({ embeds: [embedaccept] }).catch((err) => {
                    return interaction.reply(`
                        This builder has DMs turned off or something went wrong while sending the DM.
                    `)
                });

                await submissionMsg.react("✅");

                const reviewerchannelaccept = new EmbedBuilder()
                    .setDescription(`
                    ${submittingMember.toString()}'s trial build was accepted by ${reviewer}.\n[Submission Link](${submissionMsg.url}) 
                    ${feedback != undefined ? `\nFeedback: ${feedback}` : ""}
                    `)
                    .setColor(0x00FF00)

                DiscordHelpers.getTextChannel(client, client.config.opt.channels.hi_reviewers)
                    .then((channel: TextChannel | null) => {
                        if (channel && channel != null) {
                            channel.send({ embeds: [reviewerchannelaccept] });
                        }
                    });           

            } else {

                const embedreply2 = new EmbedBuilder()
                .setTitle(`**<a:SPINNYCANADAv2:1102005736655036426> REVIEWED SUCCESSFULLY <a:SPINNYCANADAv2:1102005736655036426>**`)
                .setDescription(`
                    You have denied ${submittingMember.toString()}'s build.\n[Submission Link](${submissionMsg.url})
                    ${feedback != undefined ? `\nFeedback: ${feedback}` : ""}
                `)
                
                await interaction.followUp({ embeds: [embedreply2] });

                const embeddeny = new EmbedBuilder()
                    .setTitle(`<a:SPINNYCANADAv2:1102005736655036426> Your recent trial submission has been denied. <a:SPINNYCANADAv2:1102005736655036426>`)
                    .setDescription(`
                        Your build has been **declined** from our build team. But don't worry, this happens to most people!.\n
                        As long as you follow the feedback from the reviewer, your build should be accepted. Please resubmit when you've completed your build.\n
                        Reviewer: ${reviewer}
                        ${feedback != undefined ? `\nFeedback: ${feedback}` : ""}
                    `)
                    .setColor(0xFF0000)

                await submittingMember.send({ embeds: [embeddeny] }).catch((err) => {
                    return interaction.reply(`
                        This builder has DMs turned off or something went wrong while sending the DM.
                    `)
                });

                await submissionMsg.react("❌");

                const reviewerchanneldeny = new EmbedBuilder()
                    .setDescription(`
                    ${submittingMember.toString()}'s trial build was denied by ${reviewer}.\n[Submission Link](${submissionMsg.url}) 
                    ${feedback != undefined ? `\nFeedback: ${feedback}` : ""}
                    `)
                    .setColor(0xFF0000)

                DiscordHelpers.getTextChannel(client, client.config.opt.channels.hi_reviewers)
                    .then((channel: TextChannel | null) => {
                        if (channel && channel != null) {
                            channel.send({ embeds: [reviewerchanneldeny] });
                        }
                    });
            }

        } catch (err) {
            console.error(err);
            return interaction.reply("ERROR! Check the BOT Logs!");
        }
        
    }
}
