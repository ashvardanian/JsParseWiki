var path = require('path')
var fs = require('fs')

// Source: https://gist.github.com/victorsollozzo/4134793
function recursiveFindByExtension(base, ext, files, result) {
    files = files || fs.readdirSync(base) 
    result = result || [] 

    files.forEach(function (file) {
        var newbase = path.join(base, file)
        if (fs.statSync(newbase).isDirectory()) {
            result = recursiveFindByExtension(newbase, ext, fs.readdirSync(newbase), result)
        } else {
            if (file.substr(-1 * (ext.length + 1)) == '.' + ext) {
                result.push(newbase)
            } 
        }
    })
    return result
}

function suggestCollectionName(path) {
    if (path.match(/-(latest|\d{8})-pages-articles/)) {
        return path.match(/([a-z]+)-(latest|\d{8})-pages-articles/);
    }
    return undefined
}

module.exports = {
    recursiveFindByExtension: recursiveFindByExtension,
    suggestCollectionName: suggestCollectionName
};
