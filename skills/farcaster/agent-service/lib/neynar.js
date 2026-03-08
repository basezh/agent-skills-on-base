const https = require('https');

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const NEYNAR_API_BASE = 'api.neynar.com';

/**
 * Make a GET request to Neynar API
 */
function neynarGet(path) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: NEYNAR_API_BASE,
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'api_key': NEYNAR_API_KEY
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

/**
 * Get user profile by FID
 */
async function getUserByFid(fid) {
  const data = await neynarGet(`/v2/farcaster/user/bulk?fids=${fid}`);
  return data.users?.[0] || null;
}

/**
 * Get user profile by username
 */
async function getUserByUsername(username) {
  const cleanUsername = username.replace('@', '');
  const data = await neynarGet(`/v2/farcaster/user/by_username?username=${cleanUsername}`);
  return data.user || null;
}

/**
 * Get user's recent casts
 */
async function getUserCasts(fid, limit = 10) {
  const data = await neynarGet(`/v2/farcaster/feed/user/casts?fid=${fid}&limit=${limit}`);
  return data.casts || [];
}

/**
 * Check if we're following a user
 */
async function isFollowing(viewerFid, targetFid) {
  const data = await neynarGet(`/v2/farcaster/user/bulk?fids=${targetFid}&viewer_fid=${viewerFid}`);
  const user = data.users?.[0];
  return user?.viewer_context?.following || false;
}

module.exports = { getUserByFid, getUserByUsername, getUserCasts, isFollowing };
