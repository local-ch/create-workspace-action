import * as core from '@actions/core'
import {createNamespace, calculateNamespaceIdentifier} from './create_namespace'

async function run(): Promise<void> {
  try {
    const namespaceName = calculateNamespaceIdentifier(
      core.getInput('application'),
      core.getInput('branch')
    )
    const name = await createNamespace(
      namespaceName,
      core.getInput('guild'),
      core.getInput('url')
    )
    core.setOutput('name', name)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
