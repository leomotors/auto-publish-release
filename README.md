# Auto Publish Release

Publish Release on Push with tag name from package.json

**Note**: This Action is created for personal use, any breaking changes can be made. You may use this if you want to do the same thing.

## Example: My Usage

From .github/workflows/publish.yml of this Repo

```yml
name: Publish Release

on:
  push:
    branches:
      - main

jobs:
  main:
    name: Publish Release
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v2

      - name: Publish Release
        uses: Leomotors/auto-publish-release@main
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          RELEASE_TITLE: "Auto Publish Release {VERSION}"
          VERSION_MUST_INCREASE: true
          ALWAYS_GENERATE_NOTES: true
```

**Note**: See [template.yml](./example/template.yml) for all parameters

## 📚 Available Features

Documentation so I don't forget my own tool.

### Substitution

Available in RELEASE_TITLE and CHANGELOG_BODY

Substitutions are {VERSION} and {DATE}

Example

```yml
RELEASE_TITLE: "Cocoa Grader {VERSION}"
CHANGELOG_BODY: "Created at {DATE}"
```
