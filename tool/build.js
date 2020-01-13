// @ts-check

const { exec, execFile } = require("child_process")
const { findMSBuild } = require("./find-vs2017")

/**
 * @param {string} cmd 
 * @param {import("child_process").ExecOptions} options
 */
const execAsync = (cmd, options = {}) => {
    return new Promise((resolve, reject) => {
        const c = exec(cmd, { encoding: "utf8", ...options })
        c.stdin.end()
        c.stdout.pipe(process.stdout)
        c.stderr.pipe(process.stderr)
        c.on("exit", (code) => {
            if (code === 0) {
                resolve(code)
            } else {
                reject(code)
            }
        })
    })
}


/**
 * @param {string} file
 * @param {ReadonlyArray<string>} args
 * @param {import("child_process").ExecFileOptions} options
 */
const execFileAsync = (file, args, options = {}) => {
    return new Promise((resolve, reject) => {
        const c = execFile(file, args, { encoding: "utf8", ...options })
        c.stdin.end()
        c.stdout.pipe(process.stdout)
        c.stderr.pipe(process.stderr)
        c.on("exit", (code) => {
            if (code === 0) {
                resolve(code)
            } else {
                reject(code)
            }
        })
    })
}

const build = async () => {
    await execAsync("git submodule init")
    await execAsync("git submodule update")

    if (process.platform == "win32") {
        await execAsync("git apply deps/picotlsvs_sln.patch")
        const MSBuild = await findMSBuild()
        await execFileAsync(MSBuild, [
            ".\\deps\\picotls\\picotlsvs\\picotlsvs.sln",
            "/nologo",
            "/p:Configuration=Release;Platform=x64"
        ])
    } else {
        await execAsync("cmake .", { cwd: "deps/picotls" })
        await execAsync("make", { cwd: "deps/picotls" })
        // await execAsync("make check", { cwd: "deps/picotls" })
    }

    await execAsync("git apply deps/picotls.patch")

    await execAsync("node-gyp rebuild")

    // clean up
    await execAsync("git apply deps/picotls.patch --reverse")
    if (process.platform == "win32") {
        await execAsync("git apply deps/picotlsvs_sln.patch --reverse")
    }
}

build()
