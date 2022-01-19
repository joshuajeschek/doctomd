'use strict';
const glob = require("glob-promise");

async function getAllFiles(inputDir, frontDir, preDir, postDir) {
    const result = {};
    result.input = await glob(inputDir + '/**/*.java').catch(r => {
        console.error(r);
        exit(-1);
    });
    frontDir && (result.front = await glob(frontDir + '/**/*.md').catch(r => {
        console.error(r);
        exit(-1);
    }));
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

module.exports = { getAllFiles };
