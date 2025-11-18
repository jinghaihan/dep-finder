import type { CommandOptions } from './types'
import { readFile } from 'node:fs/promises'
import { glob } from 'tinyglobby'

export async function globFiles(options: CommandOptions) {
  return await glob(['**/package.json', '**/pnpm-workspace.yaml'], {
    cwd: options.cwd,
    ignore: ['**/node_modules/**', '**/dist/**'],
    absolute: true,
    onlyFiles: true,
  })
}

export async function readJSON(filepath: string) {
  const content = await readFile(filepath, 'utf-8')
  const data = JSON.parse(content)
  return data
}
