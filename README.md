# Javadoc to Markdown Converter

Converts JavaDoc to Markdown. Based on [delight-im/Javadoc-to-Markdown](https://github.com/delight-im/Javadoc-to-Markdown)

- Can convert a complete project
- support for frontmatter / standalone files
- Customize each Markdown File with Pre- and Post-Markdown Files (will be added in front or after content)

⚠️ will delete the specified output directory before generating!

## Installation
```
npm i -g doctomd
```

## Usage
```
doctomd \
--input {input directory} \
--output {output directory} \
[--front {frontmatter directory}] \
[--pre {pre directory}] \
[--post {post directory}]
```

| flag       | description                                                                             | required |
| ---------- | --------------------------------------------------------------------------------------- | -------- |
| `--input`  | directory with input Java files                                                         | ✅       |
| `--output` | directory for output Markdown files                                                     | ✅       |
| `--front`  | directory with files for frontmatter. Can / Should also be used for standalone files    | ❌       |
| `--pre`    | content of files in this directory is put after the heading and before the doc content. | ❌       |
| `--post`   | content of files in this directory is put after the doc content                         | ❌       |

For the files in the frontmatter / pre / post directories to matched with the input Java files, the directory structure and file names should be exactly the same (excluding the file extension)

---

## Contributing:
Feel free to post issues and develop this further.

### Testing your changes
- test directory should look like this:
    ```
    test
    ├─input
    │ └─...
    ├─output
    │ └─...
    ├─post
    │ └─...
    └─pre
      └─...
    ```
- `npm run test`  
  (`node .\bin\doctomd --input test/input --output test/output --front test/front --pre test/pre --post test/post`)
