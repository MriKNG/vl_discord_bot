const {
  SlashCommandBuilder, ModalBuilder, TextInputBuilder,
  TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle
} = require('discord.js');
const config = require('../../config/config.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('apply')
    .setDescription('Apply for FiveM whitelist'),

  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('rules_confirm')
        .setPlaceholder('Have you read the server rules?')
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel('Yes, I have read and agree to the rules')
            .setValue('yes')
            .setEmoji('✅'),
          new StringSelectMenuOptionBuilder()
            .setLabel('No, I have not read the rules')
            .setValue('no')
            .setEmoji('❌')
        )
    );

    await interaction.reply({
      embeds: [new EmbedBuilder()
        .setTitle('FiveM Whitelist Application')
        .setDescription('Before applying, confirm you have read the server rules.')
        .setColor(0x5865F2)],
      components: [row],
      flags: 64
    });
  },

  async handleApplication(interaction) {
    const age      = interaction.fields.getTextInputValue('age');
    const playtime = interaction.fields.getTextInputValue('playtime');
    const reason   = interaction.fields.getTextInputValue('reason');
    const rp       = interaction.fields.getTextInputValue('rp');

    if (isNaN(age) || !Number.isInteger(Number(age)) || Number(age) < 1) {
      return interaction.reply({
        content: '❌ Age must be a valid whole number (e.g. 18).',
        flags: 64
      });
    }

    if (reason.length < 50) {
      return interaction.reply({
        content: `❌ Your reason must be at least 50 characters. You wrote ${reason.length}.`,
        flags: 64
      });
    }

    if (rp.length < 30) {
      return interaction.reply({
        content: `❌ Your RP experience must be at least 30 characters. You wrote ${rp.length}.`,
        flags: 64
      });
    }

    const reviewChannel = interaction.guild.channels.cache.get(config.applicationChannelId);
    if (!reviewChannel) {
      return interaction.reply({ content: 'Review channel not found.', flags: 64 });
    }

    const embed = new EmbedBuilder()
      .setTitle('New Whitelist Application')
      .setColor(0x5865F2)
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields(
        { name: 'Applicant',     value: `${interaction.user} (${interaction.user.tag})` },
        { name: 'Age',           value: age,      inline: true },
        { name: 'FiveM Hours',   value: playtime, inline: true },
        { name: 'Read Rules?',   value: '✅ Yes', inline: true },
        { name: 'Reason',        value: reason },
        { name: 'RP Experience', value: rp }
      )
      .setFooter({ text: `User ID: ${interaction.user.id}` })
      .setTimestamp();

    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`accept_${interaction.user.id}`)
        .setLabel('Accept')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`deny_${interaction.user.id}`)
        .setLabel('Deny')
        .setStyle(ButtonStyle.Danger)
    );

    await reviewChannel.send({ embeds: [embed], components: [buttonRow] });
    await interaction.reply({
      content: '✅ Application submitted! Staff will review it shortly.',
      flags: 64
    });
  }
};