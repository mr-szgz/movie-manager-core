import { Command, flags } from '@oclif/command'
import * as ffprobe from 'ffprobe'
import * as shell from 'shelljs'
import * as seconds2timecode from 'seconds2timecode'
import * as path from 'path'
import cli from 'cli-ux'
import { ffmpegPathFlag } from '../flags'
import * as chalk from 'chalk'
import * as termImage from 'term-img'
import * as fs from 'fs'
import { quotemark } from '../util'
// import {Md5} from 'ts-md5/dist/md5'

const termImageFile = async (filePath: string, width: string = '100%', height: string = '100%') => {
  const buffer = await fs.readFileSync(filePath)
  return termImage.string(buffer, {
    width,
    height,
    fallback: () => {
      console.log('image not supported')
    },
  })
}

export default class Screens extends Command {
  static description = 'generate screenshots for movie'

  static flags = {
    help: flags.help({ char: 'h' }),
    skip: flags.integer({ char: 's', description: 'skip <seconds> of start of video', default: 60 }),
    last: flags.integer({ char: 'l', description: 'last <seconds> before end of video', default: 45 }),
    verbose: flags.boolean({ char: 'v', description: 'show debugging', default: false }),
    ffpath: ffmpegPathFlag,
    out: flags.string({
      char: 'o',
      description: 'output diration',
      required: false,
    }),
    number: flags.integer({ char: 'n', description: 'number of screenshots', default: 12 }),
    // flag with a value (-n, --name=VALUE)
    // name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  }

  static args = [{ name: 'file' }]

  async getDuration(file: string): Promise<number> {
    const ffprobePath = await shell.exec('which ffprobe', { silent: true }).stdout.trim()

    return new Promise((resolve, reject) => {
      ffprobe(file, { path: ffprobePath }, (err: Error, info: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(parseFloat(info.streams[0].duration))
        }
      })
    })
  }

  async getProbe(file: string): Promise<{ duration: number }> {
    const ffprobePath = await shell.exec('which ffprobe', { silent: true }).stdout.trim()
    return new Promise((resolve, reject) => {
      ffprobe(file, { path: ffprobePath }, (err: Error, info: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(info.streams[0])
        }
      })
    })
  }

  async run() {
    const { args, flags } = this.parse(Screens)
    if (!args.file) {
      this.error(new Error('file is required'))
      return
    }

    const ffmpegPath = flags.ffpath
    this.log(chalk.white.bold(`\nMedia Manager - Generate Screenshots\n`))
    this.log('Input:', chalk.cyan(args.file))
    const quote = quotemark(args.file)
    const file = args.file
    const info = await this.getProbe(file)
    const duration = parseFloat(info.duration.toString())
    const interval = duration / flags.number
    let seconds = []
    const name = path.basename(file).split('.')
    const out = flags.out || path.dirname(file)
    name.pop()
    const filename = name.join('.')
    this.log('Output:', chalk.cyan(out))
    this.log('Screenshots:', chalk.cyan(flags.number))
    this.log('Duration:', chalk.cyan(duration))
    this.log('Interval:', chalk.cyan(interval))
    this.log('')
    let curr = flags.skip
    while (curr < duration) {
      curr += interval
      if (curr <= duration) {
        seconds.push(curr)
      }
    }
    // try to get that final important pic
    seconds.push(duration - flags.last)
    seconds = seconds.map(sec => {
      return sec
    })

    const frames = seconds
      .map(sec => {
        if (sec <= duration) {
          return seconds2timecode(sec)
        }
        return null
      })
      .filter(row => row && typeof row === 'string')

    let screens = []

    for (let index = 0; index < frames.length; index++) {
      const frame = frames[index]
      // const temp = Md5.hashStr(filename + index)
      const outfile = `${out}/${filename}-${index + 1}.jpg`
      let quotemark = "'"
      if (outfile.indexOf("'") >= 0) {
        quotemark = '"'
      }
      const cmd = `${ffmpegPath} -ss ${frame} -i ${quotemark}${file}${quotemark} -y -vframes 1 -q:v 1 ${quotemark}${outfile}${quotemark}`
      await shell.exec(cmd, { silent: !flags.verbose })
      console.log(await termImageFile(outfile, '75%', '75%'))
      if (await cli.confirm('Keep this image?')) {
        this.log(chalk.green('great!'))
      } else {
        cli.action.start(chalk.red('Deleting'))
        await shell.rm(outfile)
        cli.action.stop(chalk.grey('deleted'))
      }
    }

    if (await cli.confirm('open directory?')) {
      await shell.exec(`open ${quote}${out}${quote}`)
    }
    this.log(chalk.green('done'))

    this.exit(0)
  }
}
