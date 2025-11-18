import * as p from '@clack/prompts'
import c from 'ansis'

export async function getPackagesVersion(packages: string[]) {
  const versions: Record<string, string> = {}

  const { getLatestVersion } = await import('fast-npm-meta')
  for (const dep of packages) {
    const spinner = p.spinner()
    spinner.start(`getting version for ${dep}`)
    const res = await getLatestVersion(dep)
    if (res.version) {
      versions[dep] = res.version
      spinner.stop(`${c.green`${dep}`}@${c.dim`v${res.version}`}`)
    }
    else {
      spinner.stop(c.red`failed to get version for ${dep}`)
    }
  }
  return versions
}
