module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
  transpileDependencies: [
    'quasar'
  ],
  pages: {
    index: {
      entry: "./src/main.js",
      template: "public/index.html",
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
    widget: {
      entry: "./src/widget.js",
      template: "public/widget.html",
      chunks: ["chunk-vendors", "chunk-common", "widget"],
    },
  }
}
