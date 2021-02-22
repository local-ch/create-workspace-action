import {
  createNamespace,
  calculateNamespaceIdentifier
} from '../src/create_namespace'

import axios from 'axios'
jest.mock('axios')

describe('Create Namespace', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>

  let namespaceName = 'jest-test-namespace-name'
  const guild = 'nodejs'
  const url = 'https://k8s-workspaces.test/api/v1/namespaces/'

  describe('Happy Path', () => {
    beforeEach(() => {
      mockedAxios.post.mockResolvedValue({
        status: 201,
        data: {
          state: 'success',
          self_destruct: '2021-03-08',
          name: namespaceName
        }
      })
    })

    test('happy path', async () => {
      const workspaceName = await createNamespace(namespaceName, guild, url)
      expect(workspaceName).toEqual(namespaceName)
    })
  })

  describe('When service returns a non-200 status code', () => {
    beforeEach(() => {
      mockedAxios.post.mockResolvedValue({
        status: 406,
        data: {
          state: 'error',
          message: 'Unknown HTTP code from k8s API, this is likely a bug'
        }
      })
    })

    it('throws an error', () => {
      expect.assertions(1)

      expect(createNamespace(namespaceName, guild, url)).rejects.toThrow('404')
    })
  })
})

describe('calculateNamespaceIdentifier', () => {
  describe('When namespace name is too long', () => {
    const appName = 'application-name'
    const branchName = 'pro-1234-very-very-very-long-branch-name'

    it('starts with the full application name', () => {
      const identifier = calculateNamespaceIdentifier(appName, branchName)
      expect(identifier).toMatch(new RegExp(`^${appName}`))
    })

    it('adheres to length restrictions from k8s-webservice', () => {
      const identifier = calculateNamespaceIdentifier(appName, branchName)
      expect(identifier.length).toBeLessThanOrEqual(42)
    })
  })
})
