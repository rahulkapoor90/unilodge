module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
      ? '/solutions/unilodge/'
      : '/',
    outputDir: 'dist'
  }