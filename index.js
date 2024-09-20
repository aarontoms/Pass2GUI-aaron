const express = require('express')
const path = require('path')

const app = express()
const port = process.env.port || 3000

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

app.post('/pass1', function (req, res) {
    try {
        // res.json({ intermediate: "AUGEYSTOOOO", symtab: "AUGEYSTOOOO", output: "AUGEYSTOOOO" })
        const input = req.body.input
        const optab = req.body.optab
        if (!input || !optab || input === "" || optab === "") {
            return res.status(400).send('Both files need to be uploaded.')
        }

        const inputArr = input.split('\n')
        for (let i = 0; i < inputArr.length; i++) {
            inputArr[i] = inputArr[i].trim().split(/\s+/)
        }
        const optabArr = optab.split('\n')
        for (let i = 0; i < optabArr.length; i++) {
            optabArr[i] = optabArr[i].trim().split(/\s+/)
        }

        const pass1out = pass1(inputArr, optabArr)
        // await fs.writeFile('uploads/intermediate.txt', pass1out.intermediate)
        // await fs.writeFile('uploads/symtab.txt', pass1out.symtab)

        const intermediateArr = pass1out.intermediate.split('\n')
        for (let i = 0; i < intermediateArr.length; i++) {
            intermediateArr[i] = intermediateArr[i].trim().split(/\s+/)
        }
        const symtabArr = pass1out.symtab.split('\n')
        for (let i = 0; i < symtabArr.length; i++) {
            symtabArr[i] = symtabArr[i].trim().split(/\s+/)
        }

        const pass2out = pass2(optabArr, intermediateArr, symtabArr)
        // console.log(pass2out.output2)
        if (pass2out.output === "AUGEYSTOOOO" || pass2out.output2 === "AUGEYSTOOOO") {
            res.status(505)
        }
        pass2out.intermediate = pass1out.intermediate
        pass2out.symtab = pass1out.symtab
        res.json(pass2out)

    } catch (err) {
        return res.status(500).send("Assembler error.")
    }
})

function pass1(inputArr, optabArr) {
    let locctr = 0, i = 1, prev, top = 0, pos = -1
    let interAddr = []
    const symtabArr = [[]]
    let opcode
    let intermediate = "", symtab = ""
    if (inputArr[0][1] === 'START') {
        locctr = parseInt(inputArr[0][2], 16)
        prev = locctr
    } else {
        locctr = 0
    }

    while (inputArr[i][1] !== 'END') {
        let found = false
        opcode = inputArr[i][1]
        for (let x = 0; x < optabArr.length; x++) {
            if (optabArr[x][0] === opcode) {
                locctr += 3
                // console.log(opcode + " is there")
                found = true
                break
            }
        }
        if (!found) {
            if (inputArr[i][1] === 'WORD') {
                locctr += 3
            }
            else if (inputArr[i][1] === 'RESW') {
                locctr += 3 * parseInt(inputArr[i][2])

            }
            else if (inputArr[i][1] === 'RESB') {
                locctr += parseInt(inputArr[i][2])

            }
            else if (inputArr[i][1] === 'BYTE') {
                const len = inputArr[i][2].length
                locctr += len - 3

            }
            else {
                console.log("Invalid opcode")
            }
        }
        top++
        interAddr[top] = prev.toString(16)
        i++
        prev = locctr

        //symtab
        if (inputArr[i][0] !== '-') {
            // console.log(inputArr[i][0] + " ondd")
            let flag = 0
            for (let x = 0; x < symtabArr.length; x++) {
                if (symtabArr[x][0] === inputArr[i][0]) {
                    flag = 1
                    symtabArr[x][2] = 1
                }
            }
            pos++
            symtabArr[pos] = ([inputArr[i][0], prev.toString(16), flag])
        }
    }
    top++
    interAddr[top] = prev.toString(16)

    intermediate = "-\t" + inputArr[0][0] + "\t" + inputArr[0][1] + "\t" + inputArr[0][2] + "\n"
    for (let j = 1; j < interAddr.length; j++) {
        intermediate += interAddr[j] + "\t" + inputArr[j][0] + "\t" + inputArr[j][1] + "\t" + inputArr[j][2] + "\n"
    }
    intermediate = intermediate.slice(0, -1)

    for (let j = 0; j < symtabArr.length; j++) {
        symtab += symtabArr[j][0] + "\t" + symtabArr[j][1] + "\t" + symtabArr[j][2] + "\n"
    }
    symtab = symtab.slice(0, -1)

    return { intermediate, symtab }
}

function pass2(optabArr, intermediateArr, symtabArr) {
    let i = 1, objectCode
    let objectCodeArr = []

    while (intermediateArr[i][2] !== 'END') {
        let found = false
        optabArr.forEach((opLine) => {
            if (opLine[0] === intermediateArr[i][2]) {
                found = true
                objectCode = opLine[1]
                symtabArr.forEach((symLine) => {
                    if (symLine[0] === intermediateArr[i][3]) {
                        objectCode += symLine[1]
                        objectCodeArr.push(objectCode)
                    }
                })
            }
        })

        if (!found) {
            if (intermediateArr[i][2] === 'WORD') {
                const val = parseInt(intermediateArr[i][3])
                objectCode = val.toString(16).padStart(6, '0')
                objectCodeArr.push(objectCode)
            }
            else if (intermediateArr[i][2] === 'BYTE') {
                const val = intermediateArr[i][3].substring(2, intermediateArr[i][3].length - 1)
                objectCode = ""
                for (let char of val) {
                    objectCode += char.charCodeAt(0).toString(16)
                }
                objectCodeArr.push(objectCode)
            }
            else if (intermediateArr[i][2] === 'RESW' || intermediateArr[i][2] === 'RESB') {
                objectCode = "\t"
                objectCodeArr.push(objectCode)
            }
        }
        i++
    }
    objectCodeArr.push("\t")

    let output = intermediateArr[0][0] + "\t" + intermediateArr[0][1] + "\t" + intermediateArr[0][2] + "\t" + intermediateArr[0][3] + "\n"
    // console.log(intermediateArr.length)
    for (let j = 1; j < intermediateArr.length; j++) {
        output += intermediateArr[j][0] + "\t" + intermediateArr[j][1] + "\t" + intermediateArr[j][2] + "\t" + intermediateArr[j][3] + "\t" + objectCodeArr[j - 1] + "\n"
    }
    const lower = parseInt(intermediateArr[1][0], 16)
    const upper = parseInt(intermediateArr[intermediateArr.length - 1][0], 16)
    const length = upper - lower
    let output2 = "H^" + intermediateArr[0][1].padEnd(6, "_") + "^" + intermediateArr[1][0] + "^" + length.toString(16).padStart(6, "0") + "\n\n"
    let lines = intermediateArr.length - 1, x = 1, text = "", size = 0, keri = false
    // console.log(objectCodeArr)
    let start = intermediateArr[x][0]
    while (x < intermediateArr.length) {
        keri = false
        if (objectCodeArr[x - 1] === "\t") {
            x++
            continue
        }
        text += "^" + objectCodeArr[x - 1]
        size += objectCodeArr[x - 1].length / 2
        if (size > 21) {
            keri = true
            size -= objectCodeArr[x - 1].length / 2
            text = text.slice(0, -objectCodeArr[x - 1].length-1)
            output2 += "T^" + start + "^" + size.toString(16).padStart(2, "0") + text + "\n"
            start = intermediateArr[x][0]
            text = ""
            size = 0
            continue
        }
        x++
    }
    if(!keri){
        output2 += "T^" + start + "^" + size.toString(16).padStart(2, "0") + text + "\n\n"
    }

    output2 += "E^" + intermediateArr[1][0]
    // console.log(output2)

    symtabArr.forEach((symLine) => {
        if (symLine[2] == 1) {
            output = "AUGEYSTOOOO"
            output2 = "AUGEYSTOOOO"
        }
    })

    return { output, output2 }
}

app.get('/reset', async (req, res) => {
    try {
        await fs.unlink('uploads/input.txt')
        await fs.unlink('uploads/optab.txt')
        await fs.unlink('uploads/intermediate.txt')
        await fs.unlink('uploads/symtab.txt')
        await fs.unlink('uploads/output.txt')
        res.send('Files deleted successfully.')
    } catch (err) {
        // return res.status(500).send("Error deleting files.")
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})