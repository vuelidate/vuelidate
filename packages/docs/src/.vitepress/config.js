/** @type {import('vitepress').UserConfig} */
const config = {
  title: 'Vuelidate',
  description: 'A simple, but powerful, lightweight model-based validation for Vue.js 3 and 2.',
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
    algolia: {
      apiKey: 'f3200469da216e2a8bfd46e2eab6552f',
      indexName: 'vuelidate-next'
    },
    nav: [
      { text: 'General Guide', link: '/', activeMatch: '^/(?!.*(api))' },
      { text: 'Vuelidate 0.x', link: 'https://vuelidate.js.org' },
      {
        text: 'API Reference',
        link: '/api/state',
        activeMatch: '^/api/'
      }
    ],
    sidebar: {
      '/api/': getAPISidebar(),
      '/': getGuideSidebar()
    }
  }
}

function getGuideSidebar () {
  return [
    { text: 'Getting started', link: '/' },
    { text: 'Guide', link: '/guide' },
    { text: 'Advanced Usage', link: '/advanced_usage' },
    { text: 'Examples (outdated)', link: '/examples' },
    { text: 'Built-in Validators', link: '/validators' },
    { text: 'Custom Validators', link: '/custom_validators' },
    { text: 'Migration Guide', link: '/migration_guide' }
  ]
}

function getAPISidebar () {
  return [
    { text: 'Validation State', link: '/api/state' },
    { text: 'Validation Methods', link: '/api/methods' },
    { text: 'Validation Error Object', link: '/api/error_object' },
    { text: 'Validation Configuration', link: '/api/configuration' }
  ]
}

module.exports = config
