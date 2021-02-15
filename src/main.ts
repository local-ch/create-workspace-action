import * as core from '@actions/core'
import {createNamespace} from './create_namespace'

async function run(): Promise<void> {
  try {
    const name = await createNamespace(
      core.getInput('namespace'),
      core.getInput('guild')
    )
    core.setOutput('name', name)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
