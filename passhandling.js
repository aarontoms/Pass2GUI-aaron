let leftselected
let rightselected

document.addEventListener('DOMContentLoaded', () => {
    leftselected = "input"
    rightselected = "intermediate"
    document.querySelector('.input-btn').click()
    document.querySelector('.intermediate-btn').click()
})

document.querySelector('.input-btn').addEventListener('click', () => {
    if (document.querySelector('.left-box textarea').value !== localStorage.getItem('optab') && leftselected === "optab") {
        const result = confirm('You have unsaved changes. Do you want to save them?')
        if (result) {
            document.querySelector('.leftsave').click()
        } else {
            return
        }
    }

    document.querySelector('#lname').textContent = "Input File";
    leftselected = "input"
    document.querySelector('.input-btn').style.backgroundColor = "#38405c"
    document.querySelector('.optab-btn').style.backgroundColor = "#44475a"

    const text = localStorage.getItem('input')
    if (text) {
        document.querySelector('.left-box textarea').value = text
    } else {
        document.querySelector('.left-box textarea').value = ""
        document.querySelector('.left-box textarea').placeholder = "Write your input code here"
    }
})
document.querySelector('.optab-btn').addEventListener('click', () => {
    if (document.querySelector('.left-box textarea').value !== localStorage.getItem('input') && leftselected === "input") {
        const result = confirm('You have unsaved changes. Do you want to save them?')
        if (result) {
            document.querySelector('.leftsave').click()
        } else {
            return
        }
    }

    document.querySelector('#lname').innerHTML = "Optab File"
    leftselected = "optab"
    document.querySelector('.optab-btn').style.backgroundColor = "#38405c"
    document.querySelector('.input-btn').style.backgroundColor = "#44475a"

    const text = localStorage.getItem('optab')
    if (text) {
        document.querySelector('.left-box textarea').value = text
    } else {
        document.querySelector('.left-box textarea').value = ""
        document.querySelector('.left-box textarea').placeholder = "Write your optab here"
    }
})
document.querySelector('.intermediate-btn').addEventListener('click', () => {
    document.querySelector('#rname').innerHTML = "Intermediate File"
    rightselected = "intermediate"
    document.querySelector('.intermediate-btn').style.backgroundColor = "#38405c"
    document.querySelector('.symtab-btn').style.backgroundColor = "#44475a"

    const text = localStorage.getItem('intermediate')
    if (text) {
        document.querySelector('.right-box textarea').value = text
    } else {
        document.querySelector('.right-box textarea').value = ""
        document.querySelector('.right-box textarea').placeholder = "Run the assembler to generate intermediate file"
    }
})
document.querySelector('.symtab-btn').addEventListener('click', () => {
    document.querySelector('#rname').innerHTML = "Symtab File"
    rightselected = "symtab"
    document.querySelector('.symtab-btn').style.backgroundColor = "#38405c"
    document.querySelector('.intermediate-btn').style.backgroundColor = "#44475a"

    const text = localStorage.getItem('symtab')
    if (text) {
        document.querySelector('.right-box textarea').value = text
    } else {
        document.querySelector('.right-box textarea').value = ""
        document.querySelector('.right-box textarea').placeholder = "Run the assembler to generate symtab file"
    }
})

document.getElementById('editButton').addEventListener('click', function () {
    const textarea = document.querySelector('.left-box textarea')
    textarea.removeAttribute('readonly')
    textarea.focus()
})

document.querySelector('.left-box textarea').addEventListener('blur', function () {
    this.setAttribute('readonly', true)
})

document.querySelector('.leftsave').addEventListener('click', async function () {
    const textArea = document.querySelector('.left-box textarea')
    const text = textArea.value

    if (leftselected === "input") {
        localStorage.setItem('input', text)
        alert('Input file saved.')
    }
    else if (leftselected === "optab") {
        localStorage.setItem('optab', text)
        alert('Optab file saved.')
    }
    else {
        alert('Select a file to save')
    }
})

document.querySelector('.reset-btn').addEventListener('click', function () {
    const result = confirm('Do you want to clear both the files?')
    if (result) {
        localStorage.setItem('input', "")
        localStorage.setItem('optab', "")
        localStorage.setItem('intermediate', "")
        localStorage.setItem('symtab', "")
        document.querySelector('.left-box textarea').value = ""
        document.querySelector('.right-box textarea').value = ""
        intermediate = ""
        symtab = ""
    }
})

document.querySelector('.run-btn').addEventListener('click', function () {
    // localStorage.setItem('input', document.querySelector('.left-box textarea').value)

    const input = localStorage.getItem('input')
    const optab = localStorage.getItem('optab')

    if (!input || !optab) {
        alert('Input and Optab files are required to run the assembler')
        return
    }
    const inputArr = input.split('\n')
    // const inputLabels = [], inputOpcodes = [], inputOperands = []
    for (let i = 0; i < inputArr.length; i++) {
        inputArr[i] = inputArr[i].trim().split(/\s+/);
    }
    // for (let i = 0; i < arr.length; i++) {
    //     inputLabels[i] = arr[i][0]
    //     inputOpcodes[i] = arr[i][1]
    //     inputOperands[i] = arr[i][2]
    // }

    const optabArr = optab.split('\n')
    // const optabOpcodes = [], optabOperands = []
    for (let i = 0; i < optabArr.length; i++) {
        optabArr[i] = optabArr[i].trim().split(/\s+/);
    }
    // for (let i = 0; i < arr.length; i++) {
    //     optabOpcodes[i] = arr[i][0]
    //     optabOperands[i] = arr[i][1]
    // }

    pass1(inputArr, optabArr)
})

function pass1(inputArr, optabArr) {
    let locctr = 0, i = 1, prev, top = 0, pos = -1;
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

    intermediate = "\t" + inputArr[0][0] + "\t" + inputArr[0][1] + "\t" + inputArr[0][2] + "\n"
    for (let j = 1; j < interAddr.length; j++) {
        intermediate += interAddr[j] + "\t" + inputArr[j][0] + "\t" + inputArr[j][1] + "\t" + inputArr[j][2] + "\n"
    }

    for (let j = 0; j < symtabArr.length; j++) {
        symtab += symtabArr[j][0] + "\t" + symtabArr[j][1] + "\t" + symtabArr[j][2] + "\n"
    }

    localStorage.setItem('intermediate', intermediate)
    document.querySelector('.right-box textarea').value = intermediate
    localStorage.setItem('symtab', symtab)
}

document.querySelector('.left-download').addEventListener('click', async function () {
    const textArea = document.querySelector('.left-box textarea');
    const text = textArea.value;
    let sugName
    if (leftselected === "input") {
        sugName = 'input.txt'
    } else if (leftselected === "optab") {
        sugName = 'optab.txt'
    }

    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: sugName,
            types: [{
                description: 'Text Files',
                accept: { 'text/plain': ['.txt'] },
            }],
        });

        const writable = await handle.createWritable();
        await writable.write(text);
        await writable.close();
    } catch (error) {
        console.error('Error saving file:', error);
    }
})

document.querySelector('.right-download').addEventListener('click', async function () {
    const textArea = document.querySelector('.right-box textarea');
    const text = textArea.value;
    let sugName
    if (rightselected === "intermediate") {
        sugName = 'intermediate.txt'
    } else if (rightselected === "symtab") {
        sugName = 'symtab.txt'
    }

    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: sugName,
            types: [{
                description: 'Text Files',
                accept: { 'text/plain': ['.txt'] },
            }],
        });

        const writable = await handle.createWritable();
        await writable.write(text);
        await writable.close();
    } catch (error) {
        console.error('Error saving file:', error);
    }
})