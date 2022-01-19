
/**
 * checks if specified directory is a parent of the other (or same)
 * @param {string[]} dirParent could be parent
 * @param {string[]} dirChild could be child
 */
function isParentDirectory(dirParent, dirChild) {
    for (let i = 0; i < dirParent.length; i++) {
        if (dirParent[i] != dirChild[i]) return false;
    }
    return true;
}

/**
 * @param {string} file1 first file
 * @param {string} file2 second file
 */
function getFileDistance(file1, file2) {
    let file1Dirs = file1.split(/[\\\/]/).slice(0, -1);
    const file2Dirs = file2.split(/[\\\/]/).slice(0, -1);

    let cost = 0;

    while (!isParentDirectory(file1Dirs, file2Dirs)) {
        cost += 1;
        file1Dirs = file1Dirs.slice(0, -1);
    }

    cost += file2Dirs.length - file1Dirs.length;

    return cost;
}

/**
 * @param {string} from file to link from
 * @param {string} to file to link to
 */
function getRelativeLink(from, to) {
    let fromArray = from.split(/[\\\/]/)
        // .slice(0, -1);
    let toArray = to.split(/[\\\/]/)
        // .slice(0, -1);
    console.log("from:", fromArray);
    console.log("to:", toArray);

    let linkStart = 0;
    for (let i = linkStart; i < fromArray.length; i++) {
        if (i == linkStart && fromArray[i] == toArray[i]) {
            linkStart += 1;
        } else {
            toArray[i] == '..';
        }
    }
    return toArray.slice(linkStart).join("/");
}

module.exports = { getFileDistance, getRelativeLink };
