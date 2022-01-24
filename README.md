# Auto Publish Release

Publish Release on Push with tag name from package.json

**Note**: This Action is created for personal use, any breaking changes can be made. You may use this if you want to do the same thing as mine.

## Example: My Usage

From .github/workflows/publish.yml of this Repo

```yml
name: Publish Release

# * Trigger (Release new Version) on every Push to main
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
        # * In case you really want to use this, using '@main' is not recommended
        # * as breaking change can be made at anytime
        uses: Leomotors/auto-publish-release@main
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          # * Workflow fail if version does not *change*
          # * Algorithm to compare version isn't implemented yet
          # * And I have no idea on how to deal with GitHub API (Muck, where is documentation?)
          VERSION_MUST_INCREASE: true
          RELEASE_TITLE: "Auto Publish Release {VERSION}"
          ALWAYS_GENERATE_NOTES: true
```

**Note**: See [action.yml](./action.yml) for more info

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
