const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('../config.json');
const command = require('./commands/command');
const Binance = require('node-binance-api');

client.on('ready', () => {
  console.log('The client is ready');


  async function binanceCall() {
    
    const binance = new Binance().options({
      APIKEY: config.binanceKey,
      APISECRET: config.binanceSecret,
    });

    return binance.prices();
  }

/*
  setInterval(async () => {
    const ticker = await binanceCall();
    const currencyList = [
      {
        name: "BTC/EURO",
        value: parseFloat(ticker.BTCEUR)
      },
      {
        name: "ETH/EURO",
        value: parseFloat(ticker.ETHEUR)
      }
    ];
    const tickerIndex = Math.floor(Math.random() * (currencyList.length - 1) + 1);
    const currentCurrency = currencyList[tickerIndex];
*/
    client.user.setPresence({
      activity: {
        name: `modérer la modération.`,
        type: "PLAYING",
      },
    })
    /*
  }, 5000);
*/
  command(client, 'members', (msg) => {
    client.guilds.cache.forEach((guild) => {
      msg.channel.send(`\`${guild.name}\` has a total of \`${guild.memberCount}\` members (including bots).`)
    })
  });

  command(client, 'purge', (msg, args) => {
    const roleModoName = msg.guild.roles.cache.get(config.roleModo).name;
    if (!msg.member.roles.cache.find(r => r.name === roleModoName)) return;

    if (args[1] !== undefined) {
      let nbMessages = parseInt(args[1]) + 1;
      if (nbMessages >= 100) { nbMessages = 100; }
      if (nbMessages < 2) { nbMessages = 2; }

      msg.channel.bulkDelete(nbMessages);
      console.log(`Successfully deleted ${nbMessages} messages in #${msg.channel.name}`);
    }
  });

  command(client, 'price', async (msg, args) => {
    if (args[1] === 'help') {
      const helpEmbed = new Discord.MessageEmbed()
        .setColor('#ffdc18')
        .setTitle('Price help')
        .addField('Current price', 'To get the current price of the crypto, use the name of the searched pair as parameter, e.g.: `BTCEUR`. (It can be upper/lower case.)\n' +
            `e.g.: \`${config.prefix}price BTCEUR\` to get the price of the BTC/EUR pair.\n` + '\n' +
            'All pairs can be found here https://www.binance.com/fr/markets', true);
        msg.channel.send(helpEmbed);
    }

    const binance = new Binance().options({
      APIKEY: config.binanceKey,
      APISECRET: config.binanceSecret,
    });
    const symbol = args[1].toUpperCase();

    if (symbol.length > 0 && args[0] !== 'help') {
      const ticker = await binance.prices();

      if (ticker.hasOwnProperty(symbol)) {
        binance.prevDay(symbol, (error, prevDay) => {
          const bPriceChangePercent = prevDay.priceChangePercent;
          const embedColor = (bPriceChangePercent > 0) ? '#37BC0B' : '#bc1500';
          const pricePlus = (bPriceChangePercent > 0) ? '+' : '';

          const embed = new Discord.MessageEmbed()
            .setColor(embedColor)
            .setTitle(`Price of: ${symbol}`)
            .setDescription(parseFloat(ticker[symbol]) + ' (' + pricePlus + bPriceChangePercent + '%' + ')')
            .setThumbnail('https://img.kainsanders.com/si/Cge5SCLz')
            .addFields(
              { name: 'Low Price', value: parseFloat(prevDay.lowPrice), inline: true },
              { name: 'High Price', value: parseFloat(prevDay.highPrice), inline: true },
            );

          msg.channel.send(embed);
        });
      } else {
        msg.channel.send('Currency not found.');
      }
    }
  });
});

client.login(config.bottoken);
