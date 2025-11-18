import type { CAC } from 'cac'
import type { CommandOptions } from './types'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { cac } from 'cac'
import tildify from 'tildify'
import { resolveConfig } from './config'
import { NAME, VERSION } from './constants'
import { detect } from './detect'
import { openEditor } from './editor'
import { getPackagesVersion } from './npm'

try {
  const cli: CAC = cac(NAME)

  cli
    .command('', 'Discover dependency usage across multiple repositories')
    .option('--dep <dep>', 'The dependency to discover')
    .option('--get-version', 'Get the latest version of the dependencies')
    .option('--editor [editor]', 'Open the files in the editor')
    .allowUnknownOptions()
    .action(async (options: Partial<CommandOptions>) => {
      p.intro(`${c.yellow`${NAME} `}${c.dim`v${VERSION}`}`)

      const config = await resolveConfig(options)
      const packages = await detect(config)
      const versions = config.getVersion
        ? await getPackagesVersion(Object.keys(packages))
        : undefined

      const lines: string[] = []
      for (const [name, data] of Object.entries(packages)) {
        lines.push('')
        const ver = versions?.[name]
        lines.push(ver ? `${c.green(name)}@${c.dim(ver)}` : `${c.green(name)}`)
        data.forEach((item) => {
          lines.push(`  ${c.dim(tildify(item.filepath))})`)
        })
      }

      p.note(c.reset(lines.splice(1).join('\n')))
      if (!config.editor) {
        p.outro(c.green`done`)
        process.exit(0)
      }

      await openEditor(packages, config)
      p.outro(c.green`editor opened`)
    })

  cli.help()
  cli.version(VERSION)
  cli.parse()
}
catch (error) {
  console.error(error)
  process.exit(1)
}
