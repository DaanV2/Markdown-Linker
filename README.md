# Markdown Linker

This action will link all markdown files in a repository, it will link all files in subfolders as well. 
It will ignore files that are already linked. As well as files that are ignored.
tags can be specified through JSON files or HTML comments in markdown files, see [tags](#tags)
Tags are words or phrases that can be used to link files together. The action will go through all files and create links for each tag it found.

- [Markdown Linker](#markdown-linker)
  - [Action](#action)
  - [Example Workflow](#example-workflow)
  - [Tags](#tags)
    - [HTML Comments](#html-comments)
    - [JSON files](#json-files)

## Action

**Inputs**
| Input  | Required | Description                                                                 |
| ------ | -------- | --------------------------------------------------------------------------- |
| ignore | false    | Glob patterns to use on what files/folder to ignore, each line is a pattern |
| folder | false    | The folder to start as from, default to GitHub.workspace                    |

**Example**
  
```yaml
- name: 📓 Link Markdown files
  uses: DaanV2/Markdown-Linker@latest
  with:
    ignore: |
      README.md
```

## Example Workflow

```yaml
jobs:
  linking:
    runs-on: ubuntu-latest
    steps:
      - name: 📦 Checkout Repository
        uses: actions/checkout@v3

      - name: ⌛ Get Time
        id: time
        uses: nanzm/get-time-action@v1.1
        with:
          timeZone: 8
          format: "YYYY-MM-DD"

      - name: 📓 Link Markdown files
        uses: DaanV2/Markdown-Linker@latest
        with:
          ignore: |
            README.md

      - name: 📖 Commit changes
        continue-on-error: true
        run: |
          cd ${{github.workspace}}
          git config --global user.email "actions@github.com"
          git config --global user.name "actions[Bot]"
          git add .
          git commit -m "auto: 📑 Applied linking ${{ steps.time.outputs.time }}"
```

## Tags
Tags are words or phrases that can be used to link files together. The action will go through all files and create links for each tag it found.
Tags can be specified through JSON files or HTML comments in markdown files

### HTML Comments

Through HTML comments you can specify tags for a file, the tags are specified in JSON format. The tags are specified in the comment anywhere in the file.
If any other document has any of the tags specified in the comment, it will be linked to this file.

```md
<!--{"tags":["FooBar", "Foo","Bar"]}-->

# FooBar

Loprem ipsum
```

The above example will link any file that has the tags `FooBar`, `Foo` or `Bar` to this file.

### JSON files

The action will also look for JSON files in the repository, these files should be located in a .tags folder in any subfolder of the repository.
Any JSON file located in this folder will be read and parsed. The JSON file should have the following format:

```jsonc
[
  {
    "tag": "FooBar",
    "url": "https://example.com"
  },
  {
    "tag": "Foo",
    "url": "../Foo.md"
  },
  {
    "tag": "Bar",
    "url": "../Bar.md",
    //Regex
    "search": "\bBar\b"
  }
]
```