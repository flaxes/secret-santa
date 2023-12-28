# Secret-Santa Telegram bot

Secret Santa is a Western Christmas or Saint Nicholas tradition  
in which members of a group or community are randomly assigned a person to whom they give a gift.  
The identity of the gift giver is to remain a secret and should not be revealed.

## Project

This projects setups Telegram's bot and sends you a "target" when everyone is registered.  
Just setup bot. Click `/start`, describe your wishes to bot (optionally) and wait for others

## Setup

1. Clone this repo
2. Copy `config_example.json` into `config.json`
3. Create bot in Telegram via @BotFather
4. (optional) Set a picture and description of your bot in chat with BotFather
5. Obtain user's ID of your friends in Telegram in two ways:
    - Using Telegram web - open chat with your friend. Last numbers in URL is ID
    - Using Telegram desktop - Settings/Advanced/Experimental settings - Enable "Show Peer IDs in Profile".  
      Now you can see ID in profile
6. Setup your IDs and bot's token in `config.json` like in example:

```json
{
    "telegram": {
        "botToken": "111111111111:xxxxxxxxxx-xxxxxxxxxxxxxxxx"
    },
    "usersId": {
        "1111111111": "GodSanta",
        "2222222222": "John",
        "3333333333": "Adda"
    },
    "giftsFile": "./gifts",
    "timeForLastWishMin": 10
}
```

> UserID as key (left-side) and Name as value (right-side)  
> _timeForLastWishMin_ change this timer if 10 minutes is not enough

## Deploy

1. Run `npm install && node .` inside directory with repo.
2. Check logs until `Notify timer started! 10 minutes` appeared.
3. Wait for messages in Telegram or errors in logs
4. Close bot and start your **OWN & FREE** Secret Santa game
