import * as core from '@actions/core'
import {NamespaceService} from './namespace_service'

async function run(): Promise<void> {
  try {
    const service = new NamespaceService()
    service.createNamespace()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
