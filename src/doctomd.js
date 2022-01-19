'use strict'
const fs = require('fs').promises;
const getDirName = require('path').dirname;
const getFileName = require('path').basename;
const { exit } = require('process');

const JavadocToMarkdown = require('./javadoc-to-markdown');
const Modules = require('./modules');
const { getAllFiles } = require('./files');

class DoctoMd {

    static async generate(parameters) {
        console.log("doctomd has been called:", parameters);

        const modules = new Modules();
        if (typeof parameters.module === 'string') {
            parameters.module = [parameters.module];
        }
        for (const modulename of parameters.module) {
            modules.add(modulename);
        }

        const files = await getAllFiles(parameters.input, parameters.front, parameters.pre, parameters.post);
        console.log("Found these files:", JSON.stringify(files, null, 2));

        await fs.rm(parameters.output, { recursive: true, force: true });
        console.log("cleared output directory.");

        modules.process('pre', files.input);

        const output_files = [];

        // Generate Docs for each input file
        for (const input of files.input) {
            // Get filename of FRONT file, remove it from list
            let frontPath;
            let frontIndex = -1;
            if (parameters.front) {
                frontPath = input.replace(parameters.input, parameters.front).replace(/.java$/, '.md');
                frontIndex = files.front.indexOf(frontPath);
                (frontIndex > -1) && files.front.splice(frontIndex, 1);
            }
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
                (frontIndex > -1) ? frontPath : undefined,
                (preIndex > -1) ? prePath : undefined,
                (postIndex > -1) ? postPath : undefined
            );

            output_files.push(output);
        }

        // Write "lonely" frontmatter files - aka full pages
        if (parameters.front) {
            for (const front of files.front) {
                // output file name
                const output = front.replace(parameters.front, parameters.output);
                console.log(`Writing '${front}' to '${output}'`);

                // generate path if non-existent
                await fs.mkdir(getDirName(output), { recursive: true }).catch(r => {
                    console.error(r);
                    exit(-1);
                });

                // write frontmatter
                const frontContent = await fs.readFile(front, 'utf-8');
                await fs.writeFile(output, frontContent);
                output_files.push(output);
            }
        }

        modules.process('post', output_files);
    }

    static async generateClassDocs(input, output, front, pre, post) {
        console.log(`Generating '${output}'`, { input, front, pre, post });
        const converter = new JavadocToMarkdown();
        const code = await fs.readFile(input, 'utf8');
        const raw = converter.fromJavadoc(code, 1);

        // generate path if non-existent
        await fs.mkdir(getDirName(output), { recursive: true }).catch(r => {
            console.error(r);
            exit(-1);
        });

        if (front) {
            // write frontmatter
            const frontContent = await fs.readFile(front, 'utf-8');
            await fs.writeFile(output, frontContent);
            await fs.appendFile(output, '\n');
            // write Title
            await fs.appendFile(output, `# ${getFileName(input).replace(/.java$/, '')}\n`);
        } else {
            // write Title
            await fs.writeFile(output, `# ${getFileName(input).replace(/.java$/, '')}\n`);
        }

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
