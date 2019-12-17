import { Command, flags } from '@oclif/command'
import * as path from 'path'
import * as shell from 'shelljs'
import { quotemark, noStderr } from '../util'
import { ffpbPathFlag, dryRunFlag } from '../flags'
import * as chalk from 'chalk'
import { cli } from 'cli-ux'

export default class Mp4 extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({ char: 'h' }),
    ffpath: ffpbPathFlag,
    'dry-run': dryRunFlag,
    'skip-backup': flags.boolean({ char: 'b', description: 'keep backup of file', default: false }),
    force: flags.boolean({ char: 'f' }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(Mp4)
    if (!args.file || args.file.length <= 0) {
      this.error(new Error('file required'))
      return
    }
    let ffmpegPath = flags.ffpath
    this.log(chalk.white.bold(`\nMedia Manager - Convert to MP4\n`))

    const filename = path.basename(args.file)
    const ext = '.' + filename.split('.').pop()
    const out = args.file.replace(ext, '.mp4')
    const quote = quotemark(args.file)
    const command = `${ffmpegPath} -i ${quote}${args.file}${quote} -c:v libx264 -crf 23 -c:a libfdk_aac -q:a 100 ${quote}${out}${quote}`

    this.log(`Convert ${ext} to .mp4`)
    this.log('Input:', chalk.cyan(filename))
    this.log('Output:', chalk.cyan(out))
    this.log('Skip Backup:', chalk.cyan(flags['skip-backup']))
    this.log('')
    this.debug('command', command)

    if (!flags['dry-run']) {
      const res = await shell.exec(command)
      this.log('Convert done - Finishing up..')
      if (noStderr(res.stderr)) {
        if (flags['skip-backup']) {
          const remove = `rm ${quote}${args.file}${quote}`
          // this.log(`Removing.. ${chalk.magenta(args.file)}`)
          cli.action.start(`Removing.. ${chalk.magenta(args.file)}`)
          await shell.exec(remove)
        } else {
          const move = `mv ${quote}${args.file}${quote} .`
          // this.log(`Moving.. ${chalk.magenta(args.file)}`)
          cli.action.start(`Moving.. ${chalk.magenta(args.file)}`)
          await shell.exec(move)
        }
        cli.action.stop('done')
        this.log('enjoy!')
        console.log('\u0007')
        this.exit(0)
      } else {
        this.error(res.stderr)
      }
    }
  }
}
