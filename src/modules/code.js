'use strict';
const fs = require('fs').promises;

module.exports = {
    type: 'post',
    processor: async (files) => {
        for (const file of files) {
            console.log('Running code module for', file);
            let content = await fs.readFile(file, 'utf8');
            content = content.replace(/{@code [^}]+}/g, (substring) => {
                substring = substring.replace(/^{@code /, '`');
                substring = substring.replace(/}$/, '`');
                return substring;
            });
            await fs.writeFile(file, content);
        }
    }
}
