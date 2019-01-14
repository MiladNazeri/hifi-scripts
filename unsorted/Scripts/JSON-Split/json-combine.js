let fs = require('fs');
let path = require('path');
let zlib = require('zlib');

let dir_process = path.join(__dirname, 'process');

let files = fs.readdirSync(dir_process);

let shouldUnzip = process.argv[2] || true;
console.log(shouldUnzip)
let shouldCopyContents = process.argv[3] || true;
console.log(shouldCopyContents)



// Copy file from source to target - used for recurssive call
function copyFileSync(source, target) {
    let targetFile = target;

    // If target is a directory a new file with the same name will be created
    if (fs.existsSync(target)) {
        if (fs.lstatSync(target).isDirectory()) {
            targetFile = path.join(target, path.basename(source));
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

// Copy file from source to target
function copyFolderRecursiveSync(source, target) {
    var files = [];

    // Check if folder needs to be created or integrated
    var targetFolder = path.join(target, path.basename(source));
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }

    // Copy
    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function(file) {
            var curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, targetFolder);
            } else {
                copyFileSync(curSource, targetFolder);
            }
        });
    }
}

// console.log(files);
// Read the process directory

// for each directory unzip the .gz file read the .json file
let allJSONS = [];

let processDirectory = path.join(__dirname, 'process')
// if (!fs.existsSync(processDirectory)) {
//     fs.mkdirSync(processDirectory);
// }

function asyncThing (file) {
    return new Promise( (resolve, reject) => {
        let directory = path.join(dir_process, file)
        let temp_dir = fs.readdirSync(directory);
        let modelGZ = path.join(directory, temp_dir[1]);
        let fileContents = fs.createReadStream(modelGZ);
        let jsonFile = path.join(directory, file.slice(0, -3) + '.json')
        let writeStream = fs.createWriteStream(jsonFile);
        let unzip = zlib.createGunzip();
        
        fileContents.pipe(unzip).pipe(writeStream).on('finish', (err) => {
            console.log("made it to finish")
            let modelJSON = require(jsonFile);
            allJSONS.push(modelJSON);
            if (err) {
                console.log('err')
                return reject(err);
            } else {
                console.log('all good')
                resolve();
            }
        })
        console.log("file: ", file);
        if (shouldCopyContents === "true"){
            let contentDirectory = path.join(dir_process, file, "content");
            copyFolderRecursiveSync(contentDirectory, processDirectory);
        }

    })
}

async function main () {
    return files.map( async (file) => {
        const v = await asyncThing(file);
        return v;
    })
}


let finalObject = {};
finalObject.Entities = [];
let count = 0;

if (shouldUnzip === "true") {
    console.log("in should unzip")
    main()
    .then(v => Promise.all(v))
    .then(v => {
    
        allJSONS.forEach( (json,index) => {
            // console.log("index: " + index);
            // console.log("entities length:" + json.Entities.length);
            count += json.Entities.length;
            // console.log("count: " + count);
            finalObject.Entities = [...finalObject.Entities, ...json.Entities, ];
        })
        let jsonPath = path.join(__dirname, 'process', 'model.json');
        fs.writeFileSync(jsonPath, JSON.stringify(finalObject));
        // console.log(finalObject.Entities.length);
    })
    .catch(err => console.error(err))
} else {
    console.log("in should not unzip")
    files.forEach( file => {
        if (file === "content") { return; }
        let directory = path.join(dir_process, file)
        let temp_dir = fs.readdirSync(directory);
        let jsonFile = path.join(directory, file.slice(0, -3) + '.json')
        let modelJSON = require(jsonFile);
        allJSONS.push(modelJSON);
        allJSONS.forEach( (json,index) => {
            // console.log("index: " + index);
            // console.log("entities length:" + json.Entities.length);
            count += json.Entities.length;
            // console.log("count: " + count);
            finalObject.Entities = [...finalObject.Entities, ...json.Entities, ];
        })
        let jsonPath = path.join(__dirname, 'process', 'model.json');
        fs.writeFileSync(jsonPath, JSON.stringify(finalObject));
        console.log(finalObject.Entities.length);
    })
    if (shouldCopyContents === "true"){
        // console.log("file: ", file);
        let contentDirectory = path.join(dir_process, file, "content");
        copyFolderRecursiveSync(contentDirectory, processDirectory);
    }
}



