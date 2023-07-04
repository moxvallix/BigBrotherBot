import lemmybot from 'lemmy-bot';
import 'dotenv/config';
const {LemmyBot} = lemmybot;

const instance = "sopuli.xyz"
const credentials = {username: process.env.USERNAME, password: process.env.PASSWORD}
const allowList = [
  {instance: 'sopuli.xyz', communities: ['1984']}
]
const excludes = ["https://sopuli.xyz/u/Moxvallix", "https://sopuli.xyz/u/bigbrother"]
const rules = [
  {target: "name", rule: startsWithPhrase, option: "Of course", inverted: false},
  {target: "name", rule: containsPhrase, option: "is", inverted: true},
  {target: "body", rule: startsWithPhrase, option: "Like seriously", inverted: false},
  {target: "body", rule: exceedsLength, option: 48, inverted: false},
  {target: "body", rule: containsPhrase, option: "why", inverted: true},
]

const bot = new LemmyBot({
  instance: instance,
  credentials: credentials,
  federation: {
    allowList: allowList
  },
  dbFile: 'db.sqlite3',
  handlers: {
    post: {
      sort: "New",
      handle: ({
        postView,
        preventReprocess,
        botActions: { banFromCommunity }
      }) => {
        let post = postView.post
        console.log("Checking post: " + post.name)
        if (excludes.includes(postView.creator.actor_id)) {
          console.log("Post made by excluded person.")
        } else if (illegalPost(postView)) {
          console.log("Post was illegal, banning until: " + nextRuleAt().toString())
         banFromCommunity({
           ban: true,
           community_id: post.community_id,
           person_id: post.creator_id,
           expires: nextRuleAt(),
           remove_data: false,
           reason: "Thought crimes."
         })
        }
        preventReprocess();
      }
    }
  }
});

bot.start();

function illegalPost(postView) {
  let post = postView.post;
  for (const rule of rules) {
    let check = rule.rule.call(null, rule.option, post[rule.target]);
    if (check == rule.inverted) {
      return true;
    }
  }
  return false;
}

function nextRuleAt() {
  var today = new Date();
  var nextWeek = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() + ( 7 - today.getDay() )));
  return (nextWeek.getTime() / 1000);
}

// Rules

function startsWithPhrase(option, string) { return string.startsWith(option) }
function endsWithPhrase(option, string) { return string.endsWith(option) }
function containsPhrase(option, string) { return string.includes(option) }
function exceedsLength(option, string) { return string.length > option }
function isLowerCase(_option, string) { return ( string.search(/[A-Z]/) == -1 ) }
function isCapitalized(_option, string) {
  var capitalized = string.replace(/(^|\s)\S/g, function(t) { return t.toUpperCase() });
  return string == capitalized
}
function hasGrammar(_option, string) { return ( string.search(/[.,:;?]/) != -1 ) }
