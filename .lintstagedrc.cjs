module.exports = {
  '*.{ts,tsx,js,jsx,md,json,html}': ['eslint --fix', 'prettier --write'],
  '*.md': 'spellchecker -d .spellcheck-ignore.js --no-suggestions',
};
