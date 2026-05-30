const { SlashCommandBuilder, PermissionOverwriteType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config/config.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Open a support ticket'),

  async execute(interaction) {
    const { guild, user } = interaction;

    const existing = guild.channels.cache.find(c => c.name === `ticket-${user.username.toLowerCase()}`);
    if (existing) {
      return interaction.reply({ content: `You already have an open ticket: ${existing}`, ephemeral: true });
    }

    const channel = await guild.channels.create({
      name: `ticket-${user.username}`,
      parent: config.ticketCategoryId || null,
      permissionOverwrites: [
        { id: guild.id,           deny:  ['ViewChannel'] },
        { id: user.id,            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
        { id: config.staffRoleId, allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'] },
      ]
    });

    const embed = new EmbedBuilder()
      .setTitle('Support Ticket')
      .setColor(0x5865F2)
      .setDescription(`Hello ${user}, support staff will be with you shortly.\n\nDescribe your issue below.`)
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('close_ticket').setLabel('Close Ticket').setStyle(ButtonStyle.Danger)
    );

    await channel.send({ content: `${user} <@&${config.staffRoleId}>`, embeds: [embed], components: [row] });
    await interaction.reply({ content: `✅ Ticket created: ${channel}`, ephemeral: true });
  }
};