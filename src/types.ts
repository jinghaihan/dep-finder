export interface CommandOptions {
  cwd?: string
  dep?: string | string[]
  /**
   * Get the latest version of the dependencies
   */
  getVersion?: boolean
  /**
   * The editor to open the files
   */
  editor?: string
}

export interface Options extends Required<Omit<CommandOptions, 'dep'>> {
  dep: string[]
}

export interface Package {
  name: string
  filepath: string
  specifier: string
  catalogs?: string[]
}
