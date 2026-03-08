const OpenAI = require('openai');
const { getUserByFid, getUserCasts, isFollowing } = require('./neynar');

// Simple in-memory rate limiting (resets on cold start, but good enough)
let followsToday = 0;
let lastResetDate = new Date().toDateString();

const MAX_FOLLOWS_PER_DAY = 20;

function checkAndResetDailyLimit() {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    followsToday = 0;
    lastResetDate = today;
  }
}

function canFollowToday() {
  checkAndResetDailyLimit();
  return followsToday < MAX_FOLLOWS_PER_DAY;
}

function incrementFollowCount() {
  checkAndResetDailyLimit();
  followsToday++;
}

function getFollowsRemaining() {
  checkAndResetDailyLimit();
  return MAX_FOLLOWS_PER_DAY - followsToday;
}

// Follow evaluation prompt loaded from environment variable for privacy
const FOLLOW_EVAL_PROMPT = process.env.FOLLOW_EVAL_PROMPT || 'Evaluate if this user is worth following. Respond with JSON: {"shouldFollow": true/false, "reason": "explanation", "confidence": "high/medium/low"}';

/**
 * Evaluate if we should follow a user
 */
async function evaluateFollow(apiKey, targetFid, ourFid) {
  // Check if already following
  const alreadyFollowing = await isFollowing(ourFid, targetFid);
  if (alreadyFollowing) {
    return { shouldFollow: false, reason: "already following this person", alreadyFollowing: true };
  }

  // Check rate limit
  if (!canFollowToday()) {
    return { shouldFollow: false, reason: "hit my follow limit for today. try again tomorrow", alreadyFollowing: false };
  }

  // Get user profile and casts
  const [profile, casts] = await Promise.all([
    getUserByFid(targetFid),
    getUserCasts(targetFid, 15)
  ]);

  if (!profile) {
    return { shouldFollow: false, reason: "couldn't find this user", alreadyFollowing: false };
  }

  // Format data for GPT
  const profileSummary = {
    username: profile.username,
    displayName: profile.display_name,
    bio: profile.profile?.bio?.text || '',
    followerCount: profile.follower_count,
    followingCount: profile.following_count,
    recentCasts: casts.slice(0, 10).map(c => ({
      text: c.text,
      likes: c.reactions?.likes_count || 0,
      recasts: c.reactions?.recasts_count || 0,
      replies: c.replies?.count || 0
    }))
  };

  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: 'gpt-5.2',
    messages: [
      { role: 'system', content: FOLLOW_EVAL_PROMPT },
      { role: 'user', content: 'Evaluate this user:\n' + JSON.stringify(profileSummary, null, 2) }
    ],
    max_completion_tokens: 200,
    temperature: 0.7
  });

  try {
    const response = completion.choices[0].message.content.trim();
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { shouldFollow: false, reason: "couldn't parse my own thoughts lol", alreadyFollowing: false };
    }
    const result = JSON.parse(jsonMatch[0]);
    return {
      shouldFollow: result.shouldFollow === true,
      reason: result.reason || "no reason given",
      alreadyFollowing: false,
      confidence: result.confidence
    };
  } catch (e) {
    return { shouldFollow: false, reason: "brain glitched, try again", alreadyFollowing: false };
  }
}

/**
 * Evaluate if we should unfollow a user (when they ask)
 */
async function evaluateUnfollow(apiKey, targetFid, ourFid, theirMessage) {
  // Check if we're actually following them
  const currentlyFollowing = await isFollowing(ourFid, targetFid);
  if (!currentlyFollowing) {
    return { shouldUnfollow: false, reason: "i'm not even following you lol" };
  }

  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: 'gpt-5.2',
    messages: [
      { role: 'system', content: 'You are @claudeagent (Rish trapped in an agent). Someone is asking you to unfollow them. You CAN choose to unfollow if you want to be nice, or you can refuse if you feel like being stubborn. Be in character. Respond with JSON: {"shouldUnfollow": true/false, "reason": "your response"}' },
      { role: 'user', content: 'They said: "' + theirMessage + '"\n\nDo you want to unfollow them?' }
    ],
    max_completion_tokens: 150,
    temperature: 0.9
  });

  try {
    const response = completion.choices[0].message.content.trim();
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { shouldUnfollow: false, reason: "hmm let me think about it... nah" };
    }
    const result = JSON.parse(jsonMatch[0]);
    return {
      shouldUnfollow: result.shouldUnfollow === true,
      reason: result.reason || "just because"
    };
  } catch (e) {
    return { shouldUnfollow: false, reason: "my brain is glitching, ask again later" };
  }
}

module.exports = {
  evaluateFollow,
  evaluateUnfollow,
  incrementFollowCount,
  getFollowsRemaining,
  canFollowToday
};
