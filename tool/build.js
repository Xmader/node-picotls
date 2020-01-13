// @ts-check

const { execSync, execFileSync } = require("child_process")
const { findMSBuild } = require("./find-vs2017")

/**
 * @param {string} cmd 
 */
const exec = (cmd) => {
    return execSync(cmd, { encoding: "utf8" })
}

const build = async () => {
    exec("git submodule init")
    exec("git submodule update")
    exec("git apply deps/picotlsvs_sln.patch")

    if (process.platform == "win32") {
        const MSBuild = await findMSBuild()
        execFileSync(MSBuild, [
            ".\\deps\\picotls\\picotlsvs\\picotlsvs.sln",
            "/nologo",
            "/p:Configuration=Release;Platform=x64"
        ], { encoding: "utf8" })
    } else {
        exec("cmake .")
        exec("make")
        exec("make check")
    }

    exec("git apply deps/picotls.patch")

    exec("npm i")

    // clean up
    exec("git apply deps/picotls.patch --reverse")
    exec("git apply deps/picotlsvs_sln.patch --reverse")
}

build()
