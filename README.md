# pickme-bot

A Discord bot that feels left out. Whenever someone explicitly pings a user or a role that isn't the bot, it has a 1/10 chance of replying with something like *"\*sighs\* I love being that uninvited friend... goes hard..."*.

Only `@user` and `@role` mentions typed into the message count. Reply pings, `@everyone` and `@here` are ignored, and so is any message that includes the bot, directly or through a role it holds. If it was invited, it has nothing to complain about.

## Discord setup

1. Create an application in the [developer portal](https://discord.com/developers/applications).
2. On the **Bot** tab, enable **Message Content Intent** under Privileged Gateway Intents, then **Reset Token** and keep the token somewhere safe.
3. Invite it with the `bot` scope and the View Channels, Send Messages and Read Message History permissions:

   ```
   https://discord.com/oauth2/authorize?client_id=<APPLICATION_ID>&scope=bot&permissions=68608
   ```

## Running locally

```
cp .env.example .env   # fill in DISCORD_TOKEN
npm install
npm run dev
```

Set `PICKME_CHANCE=1` in `.env` to make it fire on every uninvited ping while trying it out.

## Deploying

The repo ships a `Dockerfile`, so a Railway service pointed at it builds and runs without configuration. The only variable it needs is `DISCORD_TOKEN`. There is no HTTP server, so no domain or port.

## Messages

The bank lives in `src/messages.js`. Add to it freely. Replies go out with all pings disabled, so a mention in there won't notify anyone.

## Tests

```
npm test
```
