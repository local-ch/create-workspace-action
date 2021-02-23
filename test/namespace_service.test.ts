import {NamespaceService} from '../src/namespace_service'

import axios from 'axios'
jest.mock('axios')

import * as core from '@actions/core'
jest.mock('@actions/core')

describe('NamespaceService', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>
  const mockedCore = core as jest.Mocked<typeof core>

  let subject: NamespaceService
  let appName = 'jest-app'
  let branch = 'unit-testing'
  let guild = 'jesters'
  let serviceUrl = 'https://k8s-workspaces.test/api/v1/namespaces'
  let namespaceName = `${appName}-${branch}`

  describe('Happy Path', () => {
    beforeEach(() => {
      subject = new NamespaceService(appName, branch, guild, serviceUrl)
      mockedAxios.post.mockResolvedValue({
        status: 201,
        data: {
          state: 'success',
          self_destruct: '2021-03-08',
          name: namespaceName
        }
      })
    })

    it('creates namespaces', async () => {
      const namespaceName = await subject.createNamespace()
      expect(namespaceName).toEqual(`${appName}-${branch}`)
    })

    it('uses serviceUrl', async () => {
      await subject.createNamespace()
      expect(mockedAxios.post).toHaveBeenCalledWith(
        serviceUrl,
        expect.anything()
      )
    })

    it('Calls API with correct parameters', async () => {
      await subject.createNamespace()
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({guild})
      )
    })
  })

  describe('Reading default values', () => {
    it('Reads default values from core inputs', () => {
      new NamespaceService()

      expect(mockedCore.getInput).toHaveBeenCalledWith('application')
      expect(mockedCore.getInput).toHaveBeenCalledWith('branch')
      expect(mockedCore.getInput).toHaveBeenCalledWith('guild')
      expect(mockedCore.getInput).toHaveBeenCalledWith('url')
    })
  })

  describe('Name sanitization', () => {
    beforeEach(() => {
      branch =
        'pro-1374-some_weirdly@never_ending-branch-name!containing-invalid-s#mbols'
      subject = new NamespaceService(appName, branch, guild, serviceUrl)
      mockedAxios.post.mockResolvedValue({
        status: 201,
        data: {name: namespaceName}
      })
    })

    it('sanitizes branch names', async () => {
      await subject.createNamespace()
      expect(mockedAxios.post).toHaveBeenCalledWith(
        serviceUrl,
        expect.objectContaining({
          name: 'jest-app-pro-1374-some-weirdly-never-endi'
        })
      )
    })
  })

  describe('Error handling', () => {
    beforeEach(() => {
      subject = new NamespaceService(appName, branch, guild, serviceUrl)
      mockedAxios.post.mockImplementation(() => {
        throw new Error()
      })
    })

    it('Logs and re-throws errors', async () => {
      expect.assertions(1)

      try {
        await subject.createNamespace()
      } catch (_error) {
        expect(mockedCore.error).toHaveBeenCalled()
      }
    })
  })
})
