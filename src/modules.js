'use strict';
const glob = require("glob");

class Modules {
    processors = new Map(); // string => array
    add(modulename) {
        try {
            const module = require(`./modules/${modulename}`);
            if (!module.type || !module.processor) {
                throw new Exception(`Module "${modulename}" not valid (no type / no processor)`);
            }
            if (typeof module.processor != 'function') {
                throw new Exception(`Module "${modulename}" not callable`);
            }

            if (!this.processors.has(module.type)) {
                this.processors.set(module.type, []);
            }

            this.processors.get(module.type).push(module.processor);

            console.log(`Loaded ${module.type} module "${modulename}"`);
        } catch (exception) {
            console.log(exception);
            console.log(`will not execute module ${modulename}`);
            console.log('You can add new modules on github :D');
        }
    }

    async process(type, files) {
        if (!this.processors.has(type)) return;
        for (const processor of this.processors.get(type)) {
            await processor(files);
        }
    }
}

module.exports = Modules;
