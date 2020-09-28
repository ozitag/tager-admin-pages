module.exports = {
  pages: {
    index: {
      entry: 'src/dev.ts',
    },
  },
  publicPath: process.env.VUE_APP_PUBLIC_PATH || '/',
};
