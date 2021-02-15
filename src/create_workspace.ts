import axios from 'axios'

export async function createWorkspace(
  branchName: string,
  guild: string
): Promise<string> {
  const {data} = await axios.post(
    'https://k8s-workspaces.local-stg.cloud/api/v1/namespaces',
    {
      // when branch name is too long, API throws an error.
      name: branchName.substr(0, 42),
      guild
    }
  )
  return data.name
}
