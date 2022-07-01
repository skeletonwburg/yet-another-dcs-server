/* eslint-disable @typescript-eslint/no-var-requires */
const { rm, readdir } = require('fs/promises')
const { resolve } = require('path')
const util = require('util')
const execFile = util.promisify(require('child_process').execFile);

const generatedDir = resolve('generated')

async function main() {
    // delete existing generated files
    await rm(generatedDir, { recursive: true, force: true })

    const npmBin = resolve('node_modules', '.bin')
    const bin = resolve(npmBin, 'proto-loader-gen-types')
    const protoDir = resolve('src', 'proto')
    const dcsProtoFile = resolve(protoDir, 'dcs', 'dcs.proto')

    const args = ['-I', protoDir, '-O', generatedDir, '--oneofs', '--grpcLib=@grpc/grpc-js', dcsProtoFile]

    await execFile(bin, args, { shell: true }) // shell:true makes this work on windows

    console.log(`generated types in ${generatedDir}`)
}

main().catch(error => {
    console.error('failed', error)
})

