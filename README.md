# Auto Publish Release

Create release when new tag is pushed, automatically grab changelog from CHANGELOG.md

## Example: My Usage

From .github/workflows/publish.yml of this Repo

```yml
name: Publish Release

on:
  push:
    tags:
      - "*.*"

jobs:
  main:
    name: Publish Release
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Publish Release
        uses: Leomotors/auto-publish-release@main
        with:
          githubToken: ${{ secrets.GITHUB_TOKEN }}
          tag: ${{ github.ref }}
          title: "Auto Publish Release"
```
