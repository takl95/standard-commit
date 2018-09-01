import * as inquirer from 'inquirer'
import * as autocomplete from 'inquirer-autocomplete-prompt'
import * as fuzzy from 'fuzzy'
import { CommitMessage, CommitTypes } from './commitmsg'
import { formatHeader } from './formatmsg'

export const prompt = inquirer.createPromptModule()
prompt.registerPrompt('autocomplete', autocomplete)

export async function promptHeader(message: CommitMessage = {}) {

  const answers = await prompt([
    {
      type: 'autocomplete',
      name: 'type',
      message: 'type:  ',
      suggestOnly: false,
      source: async (answers, input) => {
        input = input || message.type || ''
        const results = fuzzy.filter(input, CommitTypes)
        const matches = results.map(el => el.original)
        return matches
      }
    } as inquirer.Question,
    {
      type: 'input',
      name: 'scope',
      message: 'scope: ',
      default: message.scope || undefined,
      filter: input => input.toLowerCase().trim(),
      transformer: input => input.toLowerCase()
    },
    {
      type: 'input',
      name: 'subject',
      message: 'subject: ',
      default: message.subject || undefined,
      filter: input => input.toLowerCase().trim(),
      transformer: input => input.toLowerCase(),
      validate: (input, answers) => {
        if (!input) {
          return 'subject can not be empty'
        }
        const header = formatHeader(answers.type, answers.scope, input)
        if (header.length >= 72) {
          return 'subject is too long'
        }
        return true
      }
    }
  ])
  const { type, scope, subject } = answers
  message = Object.assign(message, { type, scope, subject })
  return message
}

export async function promptBody(lines: string[] = []) {
  const result: string[] = []
  for (let i = 0; i < 20; i++) {
    const answer = (await prompt([
      {
        type: 'input',
        name: 'body',
        message: 'body:  ',
        default: (lines && lines[i]) || undefined,
        filter: input => input.trim()
      }
    ])) as { body: string }
    const line = answer.body
    if (!line) break
    result.push(line)
  }
  return result
}

export async function promptBreakingChanges(line: string) {
  const answer = (await prompt([
    {
      type: 'input',
      name: 'breaking',
      message: 'break: ',
      default: line,
      filter: input => input.trim()
    }
  ])) as { breaking: string }
  return answer.breaking
}

export async function promptIssues(lines: string[] = []) {
  const result: string[] = []
  for (let i = 0; i < 20; i++) {
    const answer = (await prompt([
      {
        type: 'input',
        name: 'issue',
        message: 'issue: ',
        default: (lines && lines[i]) || undefined,
        filter: input => input.trim()
      }
    ])) as { issue: string }
    const line = answer.issue
    if (!line) break
    result.push(...line.split(/\s+|,|;/))
  }
  return result.filter(issue => !!issue)
}

export async function promptCommitMessage(message: CommitMessage = {}) {
  const header = await promptHeader(message)
  message = Object.assign(message, header)

  const body = await promptBody(message.body)
  message = Object.assign(message, { body })

  const breakingChanges = await promptBreakingChanges(message.breaking)
  message = Object.assign(message, { breakingChanges })

  const issues = await promptIssues(message.issues)
  message = Object.assign(message, { issues })

  return message
}

export async function promptConfirmCommit() {
  const answer = (await prompt([
    {
      type: 'confirm',
      name: 'commit',
      message: 'commit ?',
      default: true
    }
  ])) as { commit: boolean }

  return answer.commit
}
