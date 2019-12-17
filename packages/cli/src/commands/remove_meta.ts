import { Command, flags } from '@oclif/command'
import * as path from 'path'
import * as shell from 'shelljs'
import { quotemark, noStderr } from '../util'
import { cli } from 'cli-ux'
import { ffpbPathFlag } from '../flags'
import * as chalk from 'chalk'

export default class RemoveMeta extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({ char: 'h' }),
    ffpath: ffpbPathFlag,
    'skip-backup': flags.boolean({ description: 'copy original to current directory', default: false }),
    force: flags.boolean({ char: 'f' }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(RemoveMeta)
    const ffmpegPath = flags.ffpath
    const input = args.file
    const filename = path.basename(args.file)
    const out = input.replace(filename, `clean - ${filename}`)
    const quote = quotemark(args.file)
    const command = `${ffmpegPath} -i ${quote}${input}${quote} -map_metadata -1 -c:v copy -c:a copy ${quote}${out}${quote}`

    this.log(chalk.white.bold(`\nMedia Manager - Remove Metadata\n`))
    this.log('Input:', `${chalk.cyan(path.basename(input))}`)
    this.log('Output:', `${chalk.cyan(path.basename(out))}`)
    this.log('Backup:', `${chalk.magenta(!flags['skip-backup'])}`)
    this.log('')
    this.debug('command', command)

    const res = await shell.exec(command)
    if (noStderr(res.stderr)) {
      if (!flags['skip-backup']) {
        const move_input = `mv ${quote}${input}${quote} .`
        this.debug('moving input..', move_input)
        cli.action.start(`backing up input to ${process.cwd()}`)
        await shell.exec(move_input)
        cli.action.stop('done')
      } else {
        cli.action.start('removing input..')
        const rm_input = `rm ${quote}${input}${quote}`
        await shell.exec(rm_input)
        cli.action.stop('done')
      }
      const move_output = `mv ${quote}${out}${quote} ${quote}${input}${quote}`
      // this.log('move_output', move_output)
      this.debug('moving output..', move_output)
      cli.action.start('moving output')
      await shell.exec(move_output)
      cli.action.stop('done')
      this.log('done!')
      console.log('\u0007')
      this.exit(0)
    } else {
      this.error(res.stderr)
    }
  }
}
