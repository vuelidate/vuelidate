/** @type {import('vitepress').UserConfig} */
const config = {
  title: 'Vuelidate',
  head: [
    ['link', { rel: 'apple-touch-icon', sizes: '120x120' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: 'favicons/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: 'favicons/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' }],
    ['meta', { name: 'msapplication-TileColor', content: '#da532c' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }]
  ],
  themeConfig: {
    repo: 'vuelidate/vuelidate',
    docsDir: 'docs',
    sidebar: [
      { text: 'Getting started', link: '/' },
      { text: 'Guide', link: '/guide' },
      { text: 'Advanced Usage', link: '/advanced_usage' },
      { text: 'Examples (outdated)', link: '/examples' },
      { text: 'API', link: '/api' },
      { text: 'Built-in Validators', link: '/validators' },
      { text: 'Custom Validators', link: '/custom_validators' },
      { text: 'Migration Guide', link: '/migration_guide' },
    ]
  },
}

module.exports = config
