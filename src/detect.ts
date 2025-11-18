import type { Options, Package } from './types'
import { readFile } from 'node:fs/promises'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { basename } from 'pathe'
import { DEP_TYPES } from './constants'
import { globFiles, readJSON } from './io'
import { isCatalog } from './utils'

export async function detect(options: Options): Promise<Record<string, Package[]>> {
  const files = await detectFiles(options)
  return await detectPackages(files, options)
}

export async function detectFiles(options: Options): Promise<string[]> {
  const spinner = p.spinner()
  spinner.start('globbing files...')

  const files = await globFiles(options)
  if (files.length > 0) {
    spinner.stop(`found ${c.yellow(files.length)} files`)
  }
  else {
    spinner.stop(c.red`no files found`)
    p.outro(c.red`aborting`)
    process.exit(1)
  }
  return files
}

export async function detectPackages(files: string[], options: Options) {
  const packages: Record<string, Package[]> = {}

  const spinner = p.spinner()
  spinner.start('detecting dependencies...')

  for (const filepath of files) {
    switch (basename(filepath)) {
      case 'package.json':
        await detectPackageJSON(filepath, options, packages)
        break
      case 'pnpm-workspace.yaml':
        await detectPNPMWorkspaceYAML(filepath, options, packages)
        break
      default:
        break
    }
  }

  if (Object.keys(packages).length > 0) {
    spinner.stop(`detected complete`)
  }
  else {
    spinner.stop(c.red`no packages found`)
    p.outro(c.red`aborting`)
    process.exit(1)
  }
  return packages
}

export async function detectPackageJSON(filepath: string, options: Options, packages: Record<string, Package[]>) {
  const data = await readJSON(filepath)
  DEP_TYPES.forEach((depType) => {
    options.dep.forEach((dep) => {
      const update = (specifier: string) => {
        if (isCatalog(specifier))
          return

        const items = packages[dep] ?? []
        items.push({ name: dep, filepath, specifier })
        packages[dep] = items
      }

      if (depType.includes('.')) {
        const parts = depType.split('.')
        if (data[parts[0]]?.[parts[1]]?.[dep])
          update(data[parts[0]]?.[parts[1]]?.[dep])
      }
      else {
        if (data[depType]?.[dep])
          update(data[depType]?.[dep])
      }
    })
  })
}

export async function detectPNPMWorkspaceYAML(filepath: string, options: Options, packages: Record<string, Package[]>) {
  const { parsePnpmWorkspaceYaml } = await import('pnpm-workspace-yaml')
  const workspaceYaml = parsePnpmWorkspaceYaml(await readFile(filepath, 'utf-8'))
  const workspaceJSON = workspaceYaml.toJSON()

  for (const dep of options.dep) {
    const catalogs = workspaceYaml.getPackageCatalogs(dep)
    if (catalogs.length === 0)
      continue

    const update = (specifier?: string) => {
      if (!specifier)
        return

      const items = packages[dep] ?? []
      items.push({ name: dep, filepath, specifier })
      packages[dep] = items
    }

    for (const catalog of catalogs) {
      if (catalog === 'default')
        update(workspaceJSON.catalog?.[dep])
      else
        update(workspaceJSON.catalogs?.[catalog]?.[dep])
    }
  }
}
