import { ApplicationCommandOptionType, ApplicationCommandType, Channel, CommandInteraction, TextChannel, GuildMember } from 'discord.js';
import { Command } from '../command';
import { MyClient } from 'src';
import { DiscordHelpers } from '../../helpers/discord-helpers';

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
            const reviewer = interaction.user.tag;

            
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

                await interaction.followUp(`
                    **Reviewed!** You have accepted this trial submission.
                    ${submittingMember.id} has been ranked to **novice builder**
                `);
            
                await submittingMember.send(`
                    You have been **accepted** into our build team! Your rank is now **Novice Builder**.\n
                    You can build anywhere now as long as you follow our builder system, which can be found 
                    in our discord. Welcome aboard!\n
                    Reviewer: ${reviewer}
                    ${feedback != undefined ? `\nFeedback: ${feedback}` : ""}
                `);

                await submissionMsg.react("✅");

                DiscordHelpers.getTextChannel(client, client.config.opt.channels.hi_reviewers)
                    .then((channel: TextChannel | null) => {
                        if (channel && channel != null) {
                            channel.send(`${submittingMember.tag}'s trial build was accepted by ${reviewer}`);
                        }
                    });

            } else {

                await interaction.followUp(`
                    **Reviewed!** You have denied this trial submission.
                    ${submittingMember.id} has been ranked to **novice builder**
                `);

                await submittingMember.send(`
                    Your trial build has been **denied**. But don't worry, this happens to most people! 
                    Use the feedback given to improve your build, then re-submit again.\n
                    Reviewer: ${reviewer}
                    ${feedback != undefined ? `\nFeedback: ${feedback}` : ""}
                `);

                await submissionMsg.react("❌");

                DiscordHelpers.getTextChannel(client, client.config.opt.channels.hi_reviewers)
                    .then((channel: TextChannel | null) => {
                        if (channel && channel != null) {
                            channel.send(`${submittingMember.tag}'s trial build was denied by ${reviewer}`);
                        }
                    });
            }

        } catch (err) {
            console.error(err);
            return interaction.reply("ERROR! Check the BOT Logs!");
        }
        
    }
}