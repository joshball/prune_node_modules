#!/usr/bin/env node

'use strict';

var Parser = require('nomnom');
var Fs = require('fs');
var Path = require('path');

var pruneNodeModules = require('./prunenm');

var opts = Parser
    .script('prunenm')
    .option('path', {
        position: 0,
        help: "root path to search",
        required: true,
        list: false
    })
    .option('verbose', {
        abbr: 'v',
        flag: true,
        help: 'Be chatty'
    })
    .option('woulda', {
        abbr: 'w',
        flag: true,
        help: 'does not actually delete, but shows you what it woulda'
    })
    .parse();

var rootDir = Path.resolve(opts.path);
if(!Fs.existsSync(rootDir)){
    console.log('Path does not exist: ', rootDir);
    process.exit(-1);
}
console.log('');
console.log('Pruning node_modules from path: ', rootDir);
console.log('');

var ctx = {
    rootDir: rootDir,
    maxLevel: -1,
    doNotDelete: opts.woulda,
    verbose: opts.verbose,
    dirsDeleted: []
};

pruneNodeModules(ctx, ctx.rootDir);
