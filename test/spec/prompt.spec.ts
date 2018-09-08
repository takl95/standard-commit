jest.mock('../../src/lib/scopes')
import {
  promptConfirmCommit,
  promptSubject,
  promptType,
  promptScope,
  promptHeader,
  promptCommitMessage,
  suggestScopes
} from '../lib'
import * as stdin from 'bdd-stdin'

const scopes = suggestScopes as any
scopes.mockImplementation(async () => {
  return ['scope', 'other']
})

describe('prompt', () => {
  describe('promptConfirmCommit', () => {
    it('accepts enter as an answer', async () => {
      expect.hasAssertions()
      stdin('\n')
      const result = await promptConfirmCommit()
      expect(result).toEqual(true)
    })

    it('accepts yes as an answer', async () => {
      expect.hasAssertions()
      stdin('y', '\n')
      const result = await promptConfirmCommit()
      expect(result).toEqual(true)
    })

    it('accepts yes as an answer', async () => {
      expect.hasAssertions()
      stdin('n', '\n')
      const result = await promptConfirmCommit()
      expect(result).toEqual(false)
    })

    describe('promptType', () => {
      it('accepts feat as an answer', async () => {
        expect.hasAssertions()
        stdin('feat', '\n')
        const { type } = await promptType()
        expect(type).toEqual('feat')
      })

      it('to return feat by default', async () => {
        expect.hasAssertions()
        stdin('\n')
        const { type } = await promptType()
        expect(type).toEqual('feat')
      })
    })

    it('accepts edit as an answer', async () => {
      expect.hasAssertions()
      stdin('e', '\n')
      const result = await promptConfirmCommit()
      expect(result).toEqual('edit')
    })
  })

  describe('promptSubject', () => {
    it('accepts answers', async () => {
      expect.hasAssertions()
      stdin(' a valid subject ', '\n')
      const { subject } = await promptSubject()
      expect(subject).toEqual('a valid subject')
    })
  })

  describe('promptScope', () => {
    it('accepts answers', async () => {
      expect.hasAssertions()
      stdin('scope', '\n')
      const { scope } = await promptScope(['scope'])
      expect(scope).toEqual('scope')
    })
  })

  describe('promptHeader', () => {
    it('accepts answers', async () => {
      expect.hasAssertions()
      stdin('feat', '\n', 'scope', '\n', 'subject', '\n')
      const message = await promptHeader()
      expect(message).toMatchInlineSnapshot(`
Object {
  "scope": "scope",
  "subject": "subject",
  "type": "feat",
}
`)
    })
  })

  describe('promptMessage', () => {
    it('accepts answers', async () => {
      expect.hasAssertions()
      stdin(
        'feat',
        '\n',
        'scope',
        '\n',
        'subject',
        '\n',
        'body',
        '\n',
        '\n',
        'brealing',
        '\n',
        '\n',
        'issue',
        '\n',
        '\n'
      )
      const message = await promptCommitMessage()
      expect(message).toMatchInlineSnapshot(`
Object {
  "body": Array [
    "body",
  ],
  "breaking": "brealing",
  "issues": Array [],
  "scope": "scope",
  "subject": "subject",
  "type": "feat",
}
`)
    })

    it('accepts quick answers', async () => {
      expect.hasAssertions()
      stdin('\n', '\n', 'subject', '\n', '\n', '\n', '\n')
      const message = await promptCommitMessage()
      expect(message).toMatchInlineSnapshot(`
Object {
  "body": Array [],
  "breaking": "",
  "issues": Array [],
  "scope": "",
  "subject": "subject",
  "type": "feat",
}
`)
    })
  })
})