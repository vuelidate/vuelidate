const kill = require('tree-kill')
const spawn = require('child_process').spawn

const child = spawn('yarn', ['run', 'build:docs'])

child.stdout.on('data', function (data) {
  process.stdout.write(data)
  if (data.toString().trim() === 'done.') {
    kill(child.pid)
  }
})
