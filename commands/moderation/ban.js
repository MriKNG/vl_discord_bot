const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member from the server')
    .addUserOption(o => o.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(o => o.setName('reason').setDescription('Reason for ban'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';

    if (!target) return interaction.reply({ content: 'User not found.', ephemeral: true });
    if (target.id === interaction.user.id) {
      return interaction.reply({ content: 'You cannot ban yourself.', ephemeral: true });
    }

    if (target.id === interaction.guild.ownerId) {
      return interaction.reply({ content: 'You cannot ban the server owner.', ephemeral: true });
    }

    if (target.roles.highest.position >= interaction.member.roles.highest.position) {
      return interaction.reply({ content: 'You cannot ban this member because their role is equal to or higher than yours.', ephemeral: true });
    }
    
    if (!target.bannable) return interaction.reply({ content: 'I cannot ban this user.', ephemeral: true });

    await target.send({
      embeds: [new EmbedBuilder().setTitle('You have been banned')
        .setColor(0xED4245).setDescription(`**Server:** ${interaction.guild.name}\n**Reason:** ${reason}`)]
    }).catch(() => {});

    await target.ban({ reason });

    await interaction.reply({
      embeds: [new EmbedBuilder()
        .setTitle('Member Banned')
        .setColor(0xED4245)
        .addFields(
          { name: 'User', value: target.user.tag, inline: true },
          { name: 'Reason', value: reason, inline: true },
          { name: 'Moderator', value: interaction.user.tag, inline: true }
        ).setTimestamp()]
    });
  }
};