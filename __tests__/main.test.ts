import {createWorkspace} from '../src/create_workspace'

import axios from 'axios'
jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

let branchName: string
const guild = 'nodejs'

beforeEach(() => {
  mockedAxios.post.mockResolvedValue({
    data: {
      state: 'success',
      self_destruct: '2021-03-08',
      name: branchName
    }
  })
})

describe('Happy Path', () => {
  branchName = 'jest-test-branch-name'

  test('happy path', async () => {
    const workspaceName = await createWorkspace(branchName, guild)
    expect(workspaceName).toEqual(branchName)
  })
})

describe('When branch name is too long', () => {
  branchName =
    'pro-1234-this-is-a-brutally-long-branch-name-which-exeeds-all-limitations'

  it('reduces the size of branch name to suit limitations', async () => {
    await createWorkspace(branchName, guild)
    expect(
      mockedAxios.post
    ).toHaveBeenCalledWith(
      'https://k8s-workspaces.local-stg.cloud/api/v1/namespaces',
      {name: branchName.substr(0, 42), guild}
    )
  })
})
