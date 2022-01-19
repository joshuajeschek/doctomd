'use strict';
const fs = require('fs').promises;
const { getFileDistance, getRelativeLink } = require('./util/twofiles');

module.exports = {
    type: 'post',
    /**
     * @param {string[]} files output files
     */
    processor: async (files) => {
        for (const file of files) {
            console.log('Running link module for', file);
            let content = await fs.readFile(file, 'utf8');
            content = content.replace(/{@link [^}]+}/g, (substring) => {
                substring = substring.replace(/^{@link /, '');
                substring = substring.replace(/}$/, '');
                // same file
                if (substring.startsWith('#')) {
                    return '`' + substring.slice(1) + '`';
                }

                // different file
                const substringarray = substring.split('#', 1);
                const candidateRegex = new RegExp(`(^${substringarray[0]}\.md|.*[\\\/]${substringarray[0]}\.md)`);
                const candidates = files.filter((value) => value.match(candidateRegex));
                const curIndex = candidates.indexOf(file)
                if (curIndex > -1) {
                    candidates.splice(curIndex, 1);
                }
                if (candidates.length === 0) {
                    return `\`${substring}\``;
                }

                candidates.sort((a, b) => getFileDistance(file, a) - getFileDistance(file, b));

                return `[${substring}](${getRelativeLink(file, candidates[0])})`;
            });
            await fs.writeFile(file, content);
        }
    }
}
