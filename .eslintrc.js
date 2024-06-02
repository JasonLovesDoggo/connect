module.exports = {
  plugins: ['prettier'],
  extends: ['next/core-web-vitals'],
  rules: {
    'prettier/prettier': 'warn',
    'react-hooks/exhaustive-deps': 'off',
  },
};
