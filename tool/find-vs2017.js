// @ts-check

const { execFile } = require("child_process")
const path = require("path")
const fs = require("fs")

/**
 * @returns {Promise<{ path: string; sdk: string; }>}
 */
const findVS2017 = () => {
    const ps = path.join(process.env.SystemRoot, "System32", "WindowsPowerShell", "v1.0", "powershell.exe")

    const csFile = path.join(__dirname, "Find-VS2017.cs")

    const psArgs = [
        '-ExecutionPolicy', 'Unrestricted', '-NoProfile',
        '-Command', '&{Add-Type -Path \'' + csFile + '\';' +
        '[VisualStudioConfiguration.Main]::Query()}'
    ]

    return new Promise((resolve, reject) => {
        const child = execFile(ps, psArgs, { encoding: 'utf8' },
            (err, stdout) => {
                if (err) {
                    return reject(new Error('Could not use PowerShell to find VS2017'))
                }

                let vsSetup
                try {
                    vsSetup = JSON.parse(stdout)
                } catch (e) {
                    return reject(new Error('Could not use PowerShell to find VS2017'))
                }

                if (!vsSetup || !vsSetup.path || !vsSetup.sdk) {
                    return reject(new Error('No usable installation of VS2017 found'))
                }

                resolve({ "path": vsSetup.path, "sdk": vsSetup.sdk })
            }
        )
        child.stdin.end()
    })
}

const findMSBuild = async () => {
    const VS2017 = await findVS2017();
    const MSBuild2017Path = path.join(VS2017.path, 'MSBuild', '15.0', 'Bin', 'MSBuild.exe')
    const MSBuild2019Path = path.join(VS2017.path, 'MSBuild', '15.0', 'Bin', 'MSBuild.exe')

    if (fs.existsSync(MSBuild2017Path)) {
        return MSBuild2017Path
    } else if (fs.existsSync(MSBuild2019Path)) {
        return MSBuild2019Path
    } else {
        return null
    }
}

module.exports = {
    findVS2017,
    findMSBuild,
}
