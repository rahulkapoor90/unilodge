module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
      ? '/solutions/quick-pay/'
      : '/',
    outputDir: 'dist'
  }