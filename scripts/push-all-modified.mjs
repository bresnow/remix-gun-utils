import { $, question, } from 'zx'
import { cd } from 'fsxx'
import { readFile } from 'fs'
import path from 'path'
import 'zx/globals';

let cl = console.log;
$.verbose = false;
cd(path.resolve(__dirname, '..'))
let message, version
let args = process.argv.slice(3)
if (args.length > 0) {
    for (let i = 0; i < args.length; i++) {
        let arg = args[i]
        if (arg.startsWith('--message=' || '-m=' || '--message' || '-m')) {
            message = arg.split('=')[1]
        }
        if (arg.startsWith('--version=' || '-v=' || '--version' || '-v')) {
            version = arg.split('=')[1]
        }
    }
}
if (message === undefined) {
    message = await question("Message for commit: ")
    if (message === '' || message === ' ' || typeof message === 'undefined') {
        message = 'Update'
    }
}

if (version === undefined) {
    let pkgJson = JSON.parse(readFile(path.resolve(__dirname, '..', 'package.json'), 'utf8'))
    cl(pkgJson.version, "VERSION")
    version = await question("Version: ")
}
cl(message)
let { modified } = await gitAddAllModified()

$.verbose = true
await $`git commit -s -m ${`${message} \n ${modified}`}`
await $`git push`

async function gitAddAllModified() {
    let mod = await $`git status`.pipe($`grep modified:`)
    $.verbose = true
    mod.stdout.split("modified: ").forEach(async (line) => {
        let filename = line.trim()
        if (filename.length > 1) {
            await $`git add ${filename}`
        }
    })

    return {
        modified: mod.stdout.split("modified: ").reduce((acc, line) => {
            let filename = line.trim()
            if (filename.endsWith("index.lock")) {
                return acc
            }
            if (filename.length > 1) {
                acc += `${filename} \n`
            }
            return acc
        })
    }
}