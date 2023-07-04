# Big Brother Bot
## Automod bot for !1984@sopuli.xyz

This bot uses the [lemmy-bot](https://github.com/SleeplessOne1917/lemmy-bot) library, by SleeplessOne1917.
Go give them a star!

### Setup
Make sure you have node and npm. I have been using node 18.9.1.

`npm install` to install the required dependencies.

Copy `.env.example` and rename it to `.env`. Put the username and password to your bot in there.

Edit `bot.js`. Set `instance` to the instance the bot account resides on. For reliability, this should be the same
instance your community resides on.

Set `allowList` to an array of objects. The `instance` key is the instance of your community, and the `communities`
array is the list of community names to moderate.

Set `excludes` to a list of URLs of users that the bot should not moderate.

Set `rules` to an array of rule objects.

### Running the Bot
If you have bash, you can use `./bot.sh` to run the bot. This will auto-restart it if it crashes (it happens).

Otherwise, it can be run with `node bot.js`.

### Rules

The following is an example of a rule:
```
{
  target: "name",
  rule: startsWithPhrase,
  option: "Of course",
  inverted: false
}
```

`target`: one of either "name" or "body". Which part of the post should the rule apply to.  
`rule`: the rule function to apply. See the rules table.  
`option`: the parameter that is passed to the rule. See the rules table.  
`inverted`: whether to invert the rule, eg. startsWithPhrase now makes sure it doesn't start with phrase.

| Function         | Parameter | Description                                       |
|------------------|-----------|---------------------------------------------------|
| startsWithPhrase | String    | Whether the text starts with the given string.    |
| endsWithPhrase   | String    | Whether the text ends with the given string.      |
| containsPhrase   | String    | Whether the text contains the given string.       |
| exceedsLength    | Number    | Whether the text is longer than the given number. |
| isLowerCase      | Blank     | Whether the text is all lowercase.                |
| isCapitalized    | Blank     | Whether the text is capitalized.                  |
| hasGrammar       | Blank     | Whether the text has grammar.                     |