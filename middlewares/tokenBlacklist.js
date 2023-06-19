const tokenBlacklist = new Set();

function addToBlacklist(token) {
  tokenBlacklist.add(token);
}

function isInBlacklist(token) {
  return tokenBlacklist.has(token);
}

module.exports = {
  addToBlacklist,
  isInBlacklist,
};
