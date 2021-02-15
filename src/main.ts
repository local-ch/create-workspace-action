import * as core from '@actions/core'
import {createWorkspace} from './create_workspace'

async function run(): Promise<void> {
  try {
    const name = await createWorkspace(
      core.getInput('branch-name'),
      core.getInput('guild')
    )
    core.setOutput('name', name)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
