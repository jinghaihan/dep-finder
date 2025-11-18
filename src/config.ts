import type { CommandOptions, Options } from './types'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { DEFAULT_OPTIONS } from './constants'

function normalizeConfig(options: Partial<CommandOptions>) {
  // interop
  if ('default' in options)
    options = options.default as Partial<CommandOptions>

  return options
}

export async function resolveConfig(options: Partial<CommandOptions>): Promise<Options> {
  const defaults = structuredClone(DEFAULT_OPTIONS)
  options = normalizeConfig(options)

  const merged = { ...defaults, ...options }
  if (!merged.dep || !merged.dep.length) {
    p.outro(c.red`No dependency specified`)
    process.exit(1)
  }

  merged.dep = Array.isArray(merged.dep) ? merged.dep : [merged.dep]

  return merged as Options
}
