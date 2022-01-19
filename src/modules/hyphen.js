'use strict';
const fs = require('fs').promises;

module.exports = {
    type: 'post',
    processor: async (files) => {
        for (const file of files) {
            console.log('Running hyphen module for', file);
            let content = await fs.readFile(file, 'utf8');
            content = content.replace(/— -/g, '—');
            await fs.writeFile(file, content);
        }
    }
}
