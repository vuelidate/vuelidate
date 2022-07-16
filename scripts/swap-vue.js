const fs = require('fs')
const path = require('path')

const Vue2 = path.join(__dirname, '../node_modules/vue2')
// eslint-disable-next-line camelcase
const Vue2_7 = path.join(__dirname, '../node_modules/vue2.7')
const DefaultVue = path.join(__dirname, '../node_modules/vue')
const Vue3 = path.join(__dirname, '../node_modules/vue3')

const version = Number(process.argv[2]) || 3

useVueVersion(version)

function useVueVersion (version) {
  if (!fs.existsSync(DefaultVue)) {
    console.log('There is no default Vue version, finding it')
    if (version === 2 && fs.existsSync(Vue3)) {
      rename(Vue3, DefaultVue)
      console.log('Renamed "vue3" to "vue"')
    } else if (version === 2.7 && fs.existsSync(Vue2_7)) {
      rename(Vue2_7, DefaultVue)
      console.log('Renamed "vue2.7" to "vue"')
    } else {
      rename(Vue2, DefaultVue)
      console.log('Renamed "vue2" to "vue"')
    }
  }

  if (version === 3 && fs.existsSync(Vue3)) {
    resetPackageNames()
    rename(Vue3, DefaultVue)
  } else if (version === 2.7 && fs.existsSync(Vue2_7)) {
    resetPackageNames()
    rename(Vue2_7, DefaultVue)
  } else if (version === 2 && fs.existsSync(Vue2)) {
    resetPackageNames()
    rename(Vue2, DefaultVue)
  } else {
    console.log(`Vue ${version} is already in use`)
  }
}

function resetPackageNames () {
  if (!fs.existsSync(Vue3)) {
    rename(DefaultVue, Vue3)
  } else if (!fs.existsSync(Vue2_7)) {
    rename(DefaultVue, Vue2_7)
  } else if (!fs.existsSync(Vue2)) {
    rename(DefaultVue, Vue2)
  } else {
    console.error('Unable to reset package names')
  }
}

function rename (fromPath, toPath) {
  if (!fs.existsSync(fromPath)) return
  fs.rename(fromPath, toPath, function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log(`Successfully renamed ${fromPath} to ${toPath}.`)
    }
  })
}
