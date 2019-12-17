import { flags } from '@oclif/command'
import * as shell from 'shelljs'

export const dryRunFlag = flags.boolean({ char: 'r', description: 'dry run (vars only)', default: false })

export const ffmpegPathFlag = flags.string({
  description: 'ffmpeg path',
  default: () => {
    return shell.exec('which ffmpeg').stdout.trim()
  },
})

export const ffpbPathFlag = flags.string({
  description: 'ffpb path',
  default: () => {
    let ffpath = shell.exec('which ffpb', { silent: true }).stdout.trim()
    if (!ffpath || ffpath[0] != '/') {
      ffpath = shell.exec('which ffmpeg', { silent: true }).stdout.trim()
    }
    return ffpath
  },
})
