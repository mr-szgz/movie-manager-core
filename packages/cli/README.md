mm-cli
======

movie manager

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/mm-cli.svg)](https://npmjs.org/package/mm-cli)
[![Downloads/week](https://img.shields.io/npm/dw/mm-cli.svg)](https://npmjs.org/package/mm-cli)
[![License](https://img.shields.io/npm/l/mm-cli.svg)](https://github.com/electblake/mm-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g mm-cli
$ mm COMMAND
running command...
$ mm (-v|--version|version)
mm-cli/0.0.1 darwin-x64 node-v10.4.0
$ mm --help [COMMAND]
USAGE
  $ mm COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`mm help [COMMAND]`](#mm-help-command)
* [`mm mp4 [FILE]`](#mm-mp4-file)
* [`mm remove_meta [FILE]`](#mm-remove_meta-file)
* [`mm screens [FILE]`](#mm-screens-file)

## `mm help [COMMAND]`

display help for mm

```
USAGE
  $ mm help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

## `mm mp4 [FILE]`

describe the command here

```
USAGE
  $ mm mp4 [FILE]

OPTIONS
  -f, --force
  -h, --help   show CLI help
```

_See code: [src/commands/mp4.ts](https://github.com/electblake/mm-cli/blob/v0.0.1/src/commands/mp4.ts)_

## `mm remove_meta [FILE]`

describe the command here

```
USAGE
  $ mm remove_meta [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/remove_meta.ts](https://github.com/electblake/mm-cli/blob/v0.0.1/src/commands/remove_meta.ts)_

## `mm screens [FILE]`

generate screenshots for movie

```
USAGE
  $ mm screens [FILE]

OPTIONS
  -f, --force
  -h, --help           show CLI help
  -l, --last=last      [default: 45] last <seconds> before end of video
  -n, --number=number  [default: 12] number of screenshots
  -o, --out=out        output diration
  -s, --skip=skip      [default: 60] skip <seconds> of start of video
  -v, --verbose        show debugging
```

_See code: [src/commands/screens.ts](https://github.com/electblake/mm-cli/blob/v0.0.1/src/commands/screens.ts)_
<!-- commandsstop -->
