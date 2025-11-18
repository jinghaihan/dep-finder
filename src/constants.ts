import type { CommandOptions } from './types'
import pkg from '../package.json'

export const NAME = pkg.name

export const VERSION = pkg.version

export const DEFAULT_OPTIONS: Partial<CommandOptions> = {
  getVersion: true,
}

export const DEP_TYPES = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
  'resolutions',
  'overrides',
  'pnpm.overrides',
] as const

export const EDITOR_NAMES = {
  'AppCode': 'appcode',
  'Atom': 'atom',
  'Atom Beta': 'atom-beta',
  'Brackets': 'brackets',
  'Clion': 'clion',
  'Visual Studio Code': 'code',
  'Visual Studio Code Insiders': 'code-insiders',
  'VSCodium': 'codium',
  'Cursor': 'cursor',
  'Emacs': 'emacs',
  'IDEA': 'idea',
  'Notepad++': 'notepad++',
  'PyCharm': 'pycharm',
  'PhpStorm': 'phpstorm',
  'Rider': 'rider',
  'RubyMine': 'rubymine',
  'Sublime Text': 'sublime',
  'Vim': 'vim',
  'Visual Studio': 'visualstudio',
  'WebStorm': 'webstorm',
  'Zed': 'zed',
}
