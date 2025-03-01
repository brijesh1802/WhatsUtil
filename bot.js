const { Client } = require('whatsapp-web.js');
const axios = require('axios');
const qrcode = require('qrcode-terminal');
const schedule = require('node-schedule');
const fs = require('fs');

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox'],
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (message) => {
    console.log('Received message:', message.body);
    if (message.body === '!ping') {
        await message.reply('pong');
    } else if (message.body.startsWith('!remind')) {
        handleReminder(message);
    } else if (message.body.startsWith('!schedule')) {
        handleSchedule(message);
    } else if (message.body.startsWith('!note')) {
        handleNote(message);
    } else if (message.body === '!viewnotes') {
        handleViewNotes(message);
    } else if (message.body.startsWith('!weather')) {
        handleWeather(message);
    } else if (message.body.startsWith('!convert')) {
        handleCurrencyConversion(message);
    } else if (message.body.startsWith('!define')) {
        handleDictionaryLookup(message);
    } else if (message.body === '!quote') {
        handleRandomQuote(message);
    } else if (message.body.startsWith('!todo')) {
        handleTodo(message);
    }
});


async function handleReminder(message) {
    const [_, time, ...msgParts] = message.body.split(' ');
    const reminderMsg = msgParts.join(' ');
    const [hours, minutes] = time.split(':');

    schedule.scheduleJob(`${minutes} ${hours} * * *`, async () => {
        await client.sendMessage(message.from, reminderMsg);
    });

    await message.reply(`Reminder set for ${time}`);
}

async function handleSchedule(message) {
    const [_, recipient, time, ...msgParts] = message.body.split(' ');
    const scheduledMsg = msgParts.join(' ');
    const [hours, minutes] = time.split(':');
    const sender = message.from;

    let formattedRecipient = recipient.replace(/[^0-9]/g, '');
    if (!formattedRecipient.startsWith('91')) {
        formattedRecipient = '91' + formattedRecipient;
    }
    formattedRecipient += '@c.us';

    schedule.scheduleJob(`${minutes} ${hours} * * *`, async () => {
        try {
            await client.sendMessage(formattedRecipient, scheduledMsg, { from: sender });
            console.log(`Scheduled message sent from ${sender} to ${formattedRecipient}`);
        } catch (error) {
            console.error(`Failed to send scheduled message from ${sender} to ${formattedRecipient}:`, error);
        }
    });

    await message.reply(`Message scheduled for ${time} to ${recipient}`);
}

function readNotes() {
    return new Promise((resolve, reject) => {
        fs.readFile('notes.txt', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

async function handleViewNotes(message) {
    try {
        const notes = await readNotes();
        if (notes.trim() === '') {
            await message.reply('You have no saved notes.');
        } else {
            await message.reply('Your saved notes:\n\n' + notes);
        }
    } catch (error) {
        console.error('Error reading notes:', error);
        await message.reply('Sorry, there was an error retrieving your notes.');
    }
}

async function handleNote(message) {
    const note = message.body.replace('!note ', '');
    const timestamp = new Date().toLocaleString();
    const noteWithTimestamp = `[${timestamp}] ${note}\n`;
    
    fs.appendFile('notes.txt', noteWithTimestamp, (err) => {
        if (err) throw err;
        console.log('Note saved!');
    });

    await message.reply('Note saved!');
}

async function handleWeather(message) {
    const [_, city] = message.body.split(' ');
    const API_KEY = '5a6def5176eafc3bab699248483d7d24';
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    try {
        const response = await axios.get(url);
        const weather = response.data;
        await message.reply(`Weather in ${city}: ${weather.weather[0].description}, Temperature: ${weather.main.temp}°C`);
    } catch (error) {
        await message.reply('Sorry, I couldn\'t fetch the weather information.');
    }
}

async function handleCurrencyConversion(message) {
    const [_, amount, fromCurrency, toCurrency] = message.body.split(' ');
    const API_KEY = '928df8be6b621a52a72c68cb';
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`;

    try {
        const response = await axios.get(url);
        const rate = response.data.conversion_rates[toCurrency];
        const convertedAmount = (amount * rate).toFixed(2);
        await message.reply(`${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`);
    } catch (error) {
        await message.reply('Sorry, I couldn\'t perform the currency conversion.');
    }
}

async function handleDictionaryLookup(message) {
    const [_, word] = message.body.split(' ');
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
        const response = await axios.get(url);
        const definition = response.data[0].meanings[0].definitions[0].definition;
        await message.reply(`Definition of ${word}: ${definition}`);
    } catch (error) {
        await message.reply('Sorry, I couldn\'t find the definition for that word.');
    }
}

async function handleRandomQuote(message) {
    const url = 'https://api.quotable.io/random';

    try {
        const response = await axios.get(url);
        const quote = response.data;
        await message.reply(`"${quote.content}" - ${quote.author}`);
    } catch (error) {
        await message.reply('Sorry, I couldn\'t fetch a random quote.');
    }
}

const todoLists = {};

function handleTodo(message) {
    const [_, action, ...item] = message.body.split(' ');
    const userId = message.from;

    if (!todoLists[userId]) {
        todoLists[userId] = [];
    }

    switch (action) {
        case 'add':
            todoLists[userId].push(item.join(' '));
            message.reply('Item added to your to-do list.');
            break;
        case 'list':
            const list = todoLists[userId].map((item, index) => `${index + 1}. ${item}`).join('\n');
            message.reply(`Your to-do list:\n${list || 'Empty'}`);
            break;
        case 'remove':
            const index = parseInt(item[0]) - 1;
            if (index >= 0 && index < todoLists[userId].length) {
                todoLists[userId].splice(index, 1);
                message.reply('Item removed from your to-do list.');
            } else {
                message.reply('Invalid item number.');
            }
            break;
        default:
            message.reply('Invalid action. Use add, list, or remove.');
    }
}




client.initialize();
