const fs = require('fs')
const path = require('path')

const Vue2 = path.join(__dirname, '../node_modules/vue2')
// eslint-disable-next-line camelcase
const Vue2_7 = path.join(__dirname, '../node_modules/vue2.7')
const DefaultVue = path.join(__dirname, '../node_modules/vue')
const Vue3 = path.join(__dirname, '../node_modules/vue3')
const vueTemplateCompiler = path.join(__dirname, '../node_modules/vue-template-compiler')
// eslint-disable-next-line camelcase
const vueTemplateCompiler2_6 = path.join(__dirname, '../node_modules/vue-template-compiler2.6')
// eslint-disable-next-line camelcase
const vueTemplateCompiler2_7 = path.join(__dirname, '../node_modules/vue-template-compiler2.7')

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
      useTemplateCompilerVersion(2.7)
      console.log('Renamed "vue2.7" to "vue"')
    } else {
      rename(Vue2, DefaultVue)
      useTemplateCompilerVersion(2)
      console.log('Renamed "vue2" to "vue"')
    }
  }

  if (version === 3 && fs.existsSync(Vue3)) {
    resetPackageNames()
    rename(Vue3, DefaultVue)
  } else if (version === 2.7 && fs.existsSync(Vue2_7)) {
    resetPackageNames()
    rename(Vue2_7, DefaultVue)
    useTemplateCompilerVersion(2.7)
  } else if (version === 2 && fs.existsSync(Vue2)) {
    resetPackageNames()
    rename(Vue2, DefaultVue)
    useTemplateCompilerVersion(2)
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

function useTemplateCompilerVersion (version) {
  console.log('existing!! ? ', !fs.existsSync(vueTemplateCompiler))
  if (!fs.existsSync(vueTemplateCompiler)) {
    console.log('There is no default vue-template-compiler version, finding it')
    if (version === 2.7 && fs.existsSync(vueTemplateCompiler2_7)) {
      rename(vueTemplateCompiler2_7, vueTemplateCompiler)
      console.log('Renamed "vue-template-compliler2.7" to "vue-template-compliler"')
    } else {
      rename(vueTemplateCompiler2_6, vueTemplateCompiler)
      console.log('Renamed "vue-template-compliler2.6" to "vue-template-compliler"')
    }
  }
  if (version === 2.7 && fs.existsSync(vueTemplateCompiler2_7)) {
    rename(vueTemplateCompiler, vueTemplateCompiler2_6)
    rename(vueTemplateCompiler2_7, vueTemplateCompiler)
  } else if (version === 2 && fs.existsSync(vueTemplateCompiler2_6)) {
    rename(vueTemplateCompiler, vueTemplateCompiler2_7)
    rename(vueTemplateCompiler2_6, vueTemplateCompiler)
  } else {
    console.log(`vue-template-compliler ${version} is already in use`)
  }
}

function rename (fromPath, toPath) {
  if (!fs.existsSync(fromPath)) return
  fs.rename(fromPath, toPath, function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log(`Successfully renamed ${fromPath} to ${toPath} .`)
    }
  })
}
