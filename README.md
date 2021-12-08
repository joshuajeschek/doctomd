# Javadoc to Markdown Converter

Converts JavaDoc to Markdown. Based on [delight-im/Javadoc-to-Markdown](https://github.com/delight-im/Javadoc-to-Markdown)

- Can convert a complete project
- Customize each Markdown File with Pre- and Post-Markdown Files (Will be added in front or after content)
- will delete the specified output directory before generating!

## Usage
`doctomd --input {input directory} --output {output directory} --pre {pre directory} --post {post directory}`


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
  (`node .\bin\doctomd --input test/input --output test/output --pre test/pre --post test/post`)
