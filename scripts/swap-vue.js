const fs = require('fs')
const path = require('path')

const Vue2 = path.join(__dirname, '../node_modules/vue2')
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
    } else {
      rename(Vue2, DefaultVue)
      console.log('Renamed "vue2" to "vue"')
    }
  }

  if (version === 3 && fs.existsSync(Vue3)) {
    rename(DefaultVue, Vue2)
    rename(Vue3, DefaultVue)
  } else if (version === 2 && fs.existsSync(Vue2)) {
    rename(DefaultVue, Vue3)
    rename(Vue2, DefaultVue)
  } else {
    console.log(`Vue ${version} is already in use`)
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
