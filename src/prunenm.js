'use strict';
var Fs = require('fs');
var Path = require('path');
var Rimraf = require('rimraf');

function deleteNodeModulesDir(ctx, path){
    ctx.dirsDeleted.push(path);
    if(ctx.doNotDelete){
        console.log(' - WOULD delete dir: %s', path);
    }
    else {
        console.log(' - deleting dir: %s', path);
        Rimraf(path, function(err){
            if(err){
                console.log('===============================================================');
                console.log('*** ERROR deleting dir %s', path);
                console.log(err);
                console.log('===============================================================');
            }
        });
    }
}


function getSubdirectoriesSync(ctx, dir){
    var node_modules_dir;
    var subDirs = Fs.readdirSync(dir).filter(function(file){
        var filePath = Path.join(dir, file);
        if(Fs.statSync(filePath).isDirectory()){
            if(file === 'node_modules'){
                node_modules_dir = filePath;
                return false;
            }
            return true;
        }
        return false;
    });
    return {
        subDirs: subDirs,
        nmd: node_modules_dir
    };
}


function pruneNodeModules (ctx, path){
    if(ctx.verbose){
        console.log(' - checking:', path);
    }
    var sd = getSubdirectoriesSync(ctx, path);

    if(sd.nmd){
        deleteNodeModulesDir(ctx, sd.nmd);
    }

    sd.subDirs.forEach(function(subDir){
        pruneNodeModules(ctx, Path.join(path, subDir));
    })
}


module.exports = pruneNodeModules