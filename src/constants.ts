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

/// keep-sorted
export const EDITOR_NAMES = {
  'AppCode': 'appcode',
  'Atom Beta': 'atom-beta',
  'Atom': 'atom',
  'Brackets': 'brackets',
  'Clion': 'clion',
  'Cursor': 'cursor',
  'Emacs': 'emacs',
  'IDEA': 'idea',
  'Notepad++': 'notepad++',
  'PhpStorm': 'phpstorm',
  'PyCharm': 'pycharm',
  'Rider': 'rider',
  'RubyMine': 'rubymine',
  'Sublime Text': 'sublime',
  'Vim': 'vim',
  'Visual Studio Code Insiders': 'code-insiders',
  'Visual Studio Code': 'code',
  'Visual Studio': 'visualstudio',
  'VSCodium': 'codium',
  'WebStorm': 'webstorm',
  'Zed': 'zed',
}
