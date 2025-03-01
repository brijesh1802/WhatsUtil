# 📱 WhatsApp Bot Project
A versatile WhatsApp bot designed to assist users with various tasks such as reminders, notes, weather updates, currency conversions, dictionary lookups, random quotes, and to-do lists.

## 📑 Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Requirements](#requirements)
4. [Setup](#setup)
5. [Usage](#usage)
6. [Commands](#commands)
7. [Troubleshooting](#troubleshooting)
8. [Contributing](#contributing)
9. [License](#license)

## 📖 Overview
This project utilizes the `whatsapp-web.js` library to create a WhatsApp bot that can interact with users through text-based commands. It leverages Node.js and various APIs to provide a range of functionalities.

## ✨ Features
- **⏰ Reminders**: Set reminders for specific times.
- **📝 Notes**: Save and view notes.
- **🌦️ Weather Updates**: Fetch current weather conditions for a given city.
- **💱 Currency Conversion**: Convert currencies using the latest exchange rates.
- **📚 Dictionary Lookup**: Find definitions of English words.
- **💬 Random Quotes**: Receive inspirational quotes.
- **🗒️ To-Do Lists**: Manage personal to-do lists.

## 📋 Requirements
- Node.js (version 16 or higher)
- `whatsapp-web.js`
- `axios`
- `qrcode-terminal`
- `node-schedule`
- `fs` (built-in Node.js module)
- API keys for OpenWeatherMap and ExchangeRate-API

## ⚙️ Setup
1. **Install Node.js**: Ensure you have Node.js installed on your system.
2. **Clone the Repository**: Clone this repository to your local machine.
3. **Install Dependencies**: Run `npm install` to install all required packages.
4. **Set API Keys**: Replace placeholders in the code with your actual API keys for OpenWeatherMap and ExchangeRate-API.
5. **Run the Bot**: Execute `node index.js` to start the bot.

## 🚀 Usage
1. **Scan QR Code**: Once the bot is running, scan the displayed QR code using WhatsApp to link your account.
2. **Send Commands**: Use the commands listed below to interact with the bot.

## 💬 Commands
- **!ping**: Test if the bot is active.
- **!remind [time] [message]**: Set a reminder for a specific time (e.g., `!remind 14:30 Buy groceries`).
- **!schedule [recipient] [time] [message]**: Schedule a message to be sent to a recipient at a specific time.
- **!note [note]**: Save a note (e.g., `!note Remember to call John`).
- **!viewnotes**: View all saved notes.
- **!weather [city]**: Get the current weather for a city (e.g., `!weather NewYork`).
- **!convert [amount] [fromCurrency] [toCurrency]**: Convert currency (e.g., `!convert 100 USD EUR`).
- **!define [word]**: Find the definition of a word (e.g., `!define hello`).
- **!quote**: Receive a random inspirational quote.
- **!todo [action] [item]**: Manage your to-do list (e.g., `!todo add Buy milk`, `!todo list`, `!todo remove 1`).

## 🛠️ Troubleshooting
- **QR Code Issues**: Ensure your WhatsApp account is linked correctly.
- **API Errors**: Check that your API keys are valid and correctly placed in the code.
- **Node.js Errors**: Verify that Node.js is installed and running correctly.

## 🤝 Contributing
Contributions are welcome! Feel free to submit pull requests or open issues for feature requests or bug fixes.

## 📄 License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
