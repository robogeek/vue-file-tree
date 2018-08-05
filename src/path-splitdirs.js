
const _path = require('path');
const normalize = require('normalize-path');
const parsePath = require('parse-filepath');

let isWin32 = false;
let isPosix = true;

module.exports = function(path2split) {
    path2split = normalize(path2split);
    if (path2split.match(/^[a-zA-Z]\:/)) { isWin32 = true; isPosix = false; }
    if (path2split.indexOf('\\') >= 0) { isWin32 = true; isPosix = false; }
    let path = isWin32 ? _path.win32 : _path.posix;
    if (!path) path = _path;
    let parsed = path.parse ? path.parse(path2split) : parsePath(path2split);
    if (parsed.root === '') parsed.root = '.';
    let dir = parsed.dir;
    let dirz = [];
    // dirz.push(path.basename(path2split));
    do {
        dirz.unshift(path.basename(dir));
        dir = path.dirname(dir);
    } while (dir !== parsed.root);
    parsed.dirs = dirz;
    return parsed;
}