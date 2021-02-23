import * as core from '@actions/core'
import axios from 'axios'

export class NamespaceService {
  // k8s-namespaces service has a length restriction on namespace names
  static readonly maxNamespaceLength = 41

  appName: string
  branchName: string
  guild: string
  serviceUrl: string

  constructor(
    appName: string = core.getInput('application'),
    branchName: string = core.getInput('branch'),
    guild: string = core.getInput('guild'),
    serviceUrl: string = core.getInput('url')
  ) {
    this.appName = appName
    this.branchName = branchName
    this.guild = guild
    this.serviceUrl = serviceUrl
  }

  async createNamespace(): Promise<string> {
    try {
      core.info(`POST ${this.serviceUrl} === ${JSON.stringify(this.payload)}`)
      const {status, data} = await axios.post(this.serviceUrl, this.payload)
      core.info(`Response:: ${status} === Data: ${JSON.stringify(data)}`)

      return data.name
    } catch (error) {
      core.error(`Error received from k8s-workspaces service: ${error.message}`)
      throw error
    }
  }

  private get namespace(): string {
    return `${this.appName}-${this.branchName}`
      .substr(0, NamespaceService.maxNamespaceLength)
      .replace(/[^a-z0-9]|[ _]/g, '-')
  }

  private get payload(): object {
    return {
      name: this.namespace,
      guild: this.guild
    }
  }
}
