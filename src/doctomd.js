'use strict'
const fs = require('fs').promises;
const getDirName = require('path').dirname;
const getFileName = require('path').basename;
const rimraf = require("rimraf");
const glob = require("glob-promise");
const { exit } = require('process');
const JavadocToMarkdown = require('./javadoc-to-markdown');

class DoctoMd {

    static async generate(parameters) {
        console.log("doctomd has been called:", parameters);

        const files = await this.getAllFiles(parameters.input, parameters.pre, parameters.post);
        console.log("Found these files:", JSON.stringify(files, null, 2));

        rimraf.sync(parameters.output);
        console.log("cleared output directory.");

        // Generate Docs for each input file
        for (const input of files.input) {
            // Get filename of PRE file, remove it from list
            let prePath;
            let preIndex = -1;
            if (parameters.pre) {
                prePath = input.replace(parameters.input, parameters.pre).replace(/.java$/, '.md');
                preIndex = files.pre.indexOf(prePath);
                (preIndex > -1) && files.pre.splice(preIndex, 1);
            }
            // Get filename of POST file, remove it from list
            let postPath;
            let postIndex = -1;
            if (parameters.post) {
                postPath = input.replace(parameters.input, parameters.post).replace(/.java$/, '.md');
                postIndex = files.post.indexOf(postPath);
                (postIndex > -1) && files.post.splice(postIndex, 1);
            }

            // output file name
            const output = input.replace(parameters.input, parameters.output).replace(/.java$/, '.md');
            // only pass pre and post if existent
            await this.generateClassDocs(input,
                output,
                (preIndex > -1) ? prePath : undefined,
                (postIndex > -1) ? postPath : undefined
            );
        }

        // Write "lonely" pre (and matched post) files
        if (parameters.pre) {
            for (const pre of files.pre) {
                // output file name
                const output = pre.replace(parameters.pre, parameters.output);
                console.log(`Writing '${pre}' to '${output}'`);

                // Get filename of POST file, remove it from list
                let postPath;
                let postIndex = -1;
                if (parameters.post) {
                    postPath = pre.replace(parameters.pre, parameters.post);
                    postIndex = files.post.indexOf(postPath);
                    (postIndex > -1) && files.post.splice(postIndex, 1);
                }

                // generate path if non-existent
                await fs.mkdir(getDirName(output), { recursive: true }).catch(r => {
                    console.error(r);
                    exit(-1);
                });

                // write title
                await fs.writeFile(output, `# ${getFileName(pre).replace(/.md$/, '')}\n`);

                // write pre content
                const preContent = await fs.readFile(pre, 'utf-8');
                await fs.appendFile(output, preContent);

                // write post content
                if (postIndex > -1) {
                    const postContent = await fs.readFile(postPath, 'utf-8')
                    fs.appendFile(output, '\n\n---\n\n\n');
                    fs.appendFile(output, postContent);
                }

            }
        }

        // Write "lonely" post files
        if (parameters.post) {
            for (const post of files.post) {
                // output file name
                const output = post.replace(parameters.post, parameters.output);
                console.log(`Writing '${post}' to '${output}'`);


                // generate path if non-existent
                await fs.mkdir(getDirName(output), { recursive: true }).catch(r => {
                    console.error(r);
                    exit(-1);
                });

                // write title
                await fs.writeFile(output, `# ${getFileName(post).replace(/.md$/, '')}\n`);

                // write pre content
                const postContent = await fs.readFile(post, 'utf-8');
                await fs.appendFile(output, postContent);

            }
        }
    }

    static async getAllFiles(inputDir, preDir, postDir) {
        const result = {};
        result.input = await glob(inputDir + '/**/*.java').catch(r => {
            console.error(r);
            exit(-1);
        });
        preDir && (result.pre = await glob(preDir + '/**/*.md').catch(r => {
            console.error(r);
            exit(-1);
        }));
        postDir && (result.post = await glob(postDir + '/**/*.md').catch(r => {
            console.error(r);
            exit(-1);
        }));
        return result;
    }

    static async generateClassDocs(input, output, pre, post) {
        // trust me on this.
        console.log(
            `Generating '${output}' from '${input}'`
            + (pre || post ?
                ' with' + (pre ? ` pre: '${pre}'` + (post ? ` and post: '${post}'` : '') : ` post: '${post}'`)
                : ''
            )
        );
        const converter = new JavadocToMarkdown();
        const code = await fs.readFile(input, 'utf8');
        const raw = converter.fromJavadoc(code, 1);

        // generate path if non-existent
        await fs.mkdir(getDirName(output), { recursive: true }).catch(r => {
            console.error(r);
            exit(-1);
        });

        // write Title
        await fs.writeFile(output, `# ${getFileName(input).replace(/.java$/, '')}\n`);

        // write pre
        if (pre) {
            const preContent = await fs.readFile(pre, 'utf-8');
            await fs.appendFile(output, preContent);
            await fs.appendFile(output, '\n---\n\n');
        }

        // write actual docs
        await fs.appendFile(output, raw);

        // write post
        if (post) {
            const postContent = await fs.readFile(post, 'utf-8');
            await fs.appendFile(output, '\n---\n\n');
            await fs.appendFile(output, postContent);
        }
    }
}

module.exports = DoctoMd;
