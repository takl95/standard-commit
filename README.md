# standard-commit-2

A zero-config opiniated, [commitizen](https://github.com/commitizen/cz-cli)
like command line utility to use
[conventional commits](https://conventionalcommits.org/).

- **gcc**: Same as `git commit` but with prompt and formatting of the
  commit message.

## Installation
```bash
npm install -g standard-commit-2
```
## Usage
```bash
gcc --help
```
## Git Alias
```bash
git config --global alias.cc "!standard-commit-2"
# Now you can use:
git gcc
```
## Update

```bash
npm update -g standard-commit-2
```

## Configuration
Use the suggested defaults.
```bash
gcc --init
```
you can configure standard-commit via a `.standard-commitrc` file. You should add this file to the git repo.
