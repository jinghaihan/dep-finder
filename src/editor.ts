import type { Options, Package } from './types'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import launchEditor from 'launch-editor'
import tildify from 'tildify'
import { EDITOR_NAMES } from './constants'

export async function openEditor(packages: Record<string, Package[]>, options: Options) {
  const { editor } = options

  const packagesMapping: Record<string, Package[]> = {}
  const filepath = new Set<string>()
  for (const data of Object.values(packages)) {
    for (const item of data) {
      filepath.add(item.filepath)
      const items = packagesMapping[item.filepath] ?? []
      items.push(item)
      packagesMapping[item.filepath] = items
    }
  }

  const open = async (editor: string) => {
    const files = await p.multiselect({
      message: `select files to open (${c.yellow(filepath.size)})`,
      options: Array.from(filepath).map(file => ({
        label: tildify(file),
        value: file,
        hint: packagesMapping[file]?.map(item => `${c.green(item.name)}@${c.dim(item.specifier)}`).join(' · '),
      })),
      initialValues: Array.from(filepath),
    })
    if (p.isCancel(files) || !files) {
      p.outro(c.red`aborting`)
      process.exit(1)
    }

    const errors: string[] = []
    for (const file of files) {
      launchEditor(
        file,
        editor,
        (fileName: string, errorMessage: string | null) => {
          errors.push(
            errorMessage
              ? `[${c.yellow(fileName)}] ${c.red(errorMessage)}`
              : c.red`failed to open ${c.yellow(fileName)}`,
          )
        },
      )
    }
  }

  if (EDITOR_NAMES[editor as keyof typeof EDITOR_NAMES] || Object.values(EDITOR_NAMES).includes(editor)) {
    await open(EDITOR_NAMES[editor as keyof typeof EDITOR_NAMES] ?? editor)
  }
  else {
    const editorName = await p.select({
      message: 'select an editor',
      options: Object.entries(EDITOR_NAMES).map(([label, value]) => ({
        label,
        value,
      })),
      initialValue: 'code',
    })
    if (p.isCancel(editorName) || !editorName) {
      p.outro(c.red`aborting`)
      process.exit(1)
    }
    await open(editorName)
  }
}
