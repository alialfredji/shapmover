
process.stdin.resume()
process.stdin.setEncoding('utf8')
process.stdout.write('=======> New session started')
process.stdout.write('\n')

require('./features/rectangle').start()