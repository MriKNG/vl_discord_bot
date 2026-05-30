const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config/config.js');

async function handleReview(interaction) {
  if (!interaction.member.roles.cache.has(config.staffRoleId)) {
    return interaction.reply({
      content: 'You are not allowed to review applications.',
      ephemeral: true
    });
  }
  
  const [action, userId] = interaction.customId.split('_');
  const member = await interaction.guild.members.fetch(userId).catch(() => null);

  const originalEmbed = interaction.message.embeds[0];

  if (action === 'accept') {
    const role = interaction.guild.roles.cache.get(config.whitelistRoleId);
    if (member && role) await member.roles.add(role);

    if (member) {
      await member.send({
        embeds: [new EmbedBuilder()
          .setTitle('Application Accepted')
          .setColor(0x57F287)
          .setDescription('Congratulations! You have been whitelisted on our FiveM server.')
          .setTimestamp()]
      }).catch(() => {});
    }

    // Rebuild the embed with green color + accepted stamp
    const updatedEmbed = new EmbedBuilder()
      .setTitle(originalEmbed.title)
      .setColor(0x57F287)
      .setDescription(originalEmbed.description || null)
      .addFields(originalEmbed.fields)
      .setThumbnail(originalEmbed.thumbnail?.url ?? null)
      .setFooter(originalEmbed.footer ? { text: originalEmbed.footer.text } : null)
      .setTimestamp(originalEmbed.timestamp ? new Date(originalEmbed.timestamp) : null);

    const stampRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('handled')
        .setLabel(`✅ Accepted by ${interaction.user.tag}`)
        .setStyle(ButtonStyle.Success)
        .setDisabled(true)
    );

    await interaction.update({ embeds: [updatedEmbed], components: [stampRow] });

  } else {
    if (member) {
      await member.send({
        embeds: [new EmbedBuilder()
          .setTitle('Application Denied')
          .setColor(0xED4245)
          .setDescription('Unfortunately your whitelist application was denied. You may re-apply later.')
          .setTimestamp()]
      }).catch(() => {});
    }

    // Rebuild the embed with red color + denied stamp
    const updatedEmbed = new EmbedBuilder()
      .setTitle(originalEmbed.title)
      .setColor(0xED4245)
      .setDescription(originalEmbed.description || null)
      .addFields(originalEmbed.fields)
      .setThumbnail(originalEmbed.thumbnail?.url ?? null)
      .setFooter(originalEmbed.footer ? { text: originalEmbed.footer.text } : null)
      .setTimestamp(originalEmbed.timestamp ? new Date(originalEmbed.timestamp) : null);

    const stampRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('handled')
        .setLabel(`❌ Denied by ${interaction.user.tag}`)
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true)
    );

    await interaction.update({ embeds: [updatedEmbed], components: [stampRow] });
  }
}

module.exports = { handleReview };