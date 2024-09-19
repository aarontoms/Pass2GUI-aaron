let leftselected, rightselected, side

document.addEventListener('DOMContentLoaded', async () => {
    leftselected = "input"
    rightselected = "intermediate"
    document.querySelector('.input-btn').click()
    document.querySelector('.intermediate-btn').click()
})

document.querySelector('.left-box textarea').addEventListener('blur', function () {
    this.setAttribute('readonly', true)
    document.querySelector('.leftsave').click()
})

document.querySelector('.input-btn').addEventListener('click', async () => {
    if (document.querySelector('.left-box textarea').value !== localStorage.getItem('optab.txt') && leftselected === "optab" && localStorage.getItem('optab.txt')) {
        const result = confirm('You have unsaved changes. Do you want to save them?')
        if (result) {
            document.querySelector('.leftsave').click()
        } else {
            return
        }
    }

    document.querySelector('#lname').textContent = "Input File"
    leftselected = "input"
    document.querySelector('.input-btn').style.backgroundColor = "#38405c"
    document.querySelector('.optab-btn').style.backgroundColor = "#44475a"

    const text = localStorage.getItem('input.txt')
    if (text) {
        document.querySelector('.left-box textarea').value = text
    } else {
        document.querySelector('.left-box textarea').value = ""
        document.querySelector('.left-box textarea').placeholder = "Write your input code here"
    }
})
document.querySelector('.optab-btn').addEventListener('click', async () => {
    if (document.querySelector('.left-box textarea').value !== localStorage.getItem('input.txt') && leftselected === "input" && localStorage.getItem('input.txt')) {
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

    const text = localStorage.getItem('optab.txt')
    if (text) {
        document.querySelector('.left-box textarea').value = text
    } else {
        document.querySelector('.left-box textarea').value = ""
        console.log('No optab file found in local storage')
        document.querySelector('.left-box textarea').placeholder = "Write your optab code here"
    }
})

document.querySelector('.intermediate-btn').addEventListener('click', async () => {
    document.querySelector('#rname').innerHTML = "Intermediate File"
    rightselected = "intermediate"
    document.querySelector('.intermediate-btn').style.backgroundColor = "#38405c"
    document.querySelectorAll('.symtab-btn, .output-btn').forEach((btn) => {
        btn.style.backgroundColor = "#44475a"
    })

    const text = localStorage.getItem('intermediate.txt')
    if (text) {
        document.querySelector('.right-box textarea').value = text
    } else {
        document.querySelector('.right-box textarea').value = ""
        document.querySelector('.right-box textarea').placeholder = "Run the assembler to generate intermediate file"
    }
})
document.querySelector('.symtab-btn').addEventListener('click', async () => {
    document.querySelector('#rname').innerHTML = "Symtab File"
    rightselected = "symtab"
    document.querySelector('.symtab-btn').style.backgroundColor = "#38405c"
    document.querySelectorAll('.intermediate-btn, .output-btn').forEach((btn) => {
        btn.style.backgroundColor = "#44475a"
    })

    const text = localStorage.getItem('symtab.txt')
    if (text) {
        document.querySelector('.right-box textarea').value = text
    } else {
        document.querySelector('.right-box textarea').value = ""
        document.querySelector('.right-box textarea').placeholder = "Run the assembler to generate symtab file"
    }
})
document.querySelector('.output-btn').addEventListener('click', async () => {
    document.querySelector('#rname').innerHTML = "Output File"
    rightselected = "output"
    document.querySelector('.output-btn').style.backgroundColor = "#38405c"
    document.querySelectorAll('.symtab-btn, .intermediate-btn').forEach((btn) => {
        btn.style.backgroundColor = "#44475a"
    })

    const text = localStorage.getItem('output.txt')
    if (text && text !== "AUGEYSTOOOO") {
        document.querySelector('.right-box textarea').value = text
    } else {
        document.querySelector('.right-box textarea').value = ""
        document.querySelector('.right-box textarea').placeholder = "Run the assembler to generate output file"
    }
})

document.getElementById('editButton').addEventListener('click', function () {
    const textarea = document.querySelector('.left-box textarea')
    textarea.removeAttribute('readonly')
    textarea.focus()
})

document.querySelector('.leftsave').addEventListener('click', async function () {
    console.log('leftsave clicked')
    const textArea = document.querySelector('.left-box textarea')
    const content = textArea.value

    let fileName
    if (leftselected === "input") {
        fileName = 'input.txt'
    } else if (leftselected === "optab") {
        fileName = 'optab.txt'
    }

    localStorage.setItem(fileName, content)
})

document.querySelector('.left-download').addEventListener('click', async function () {
    side = "left"
})
document.querySelector('.right-download').addEventListener('click', async function () {
    side = "right"
})
document.querySelectorAll('.download').forEach(element => {
    element.addEventListener('click', async function () {
        let fileName
        if (side === "left") {
            leftselected === "input" ? fileName = 'input.txt' : fileName = 'optab.txt'
        } else if (side === "right") {
            if (rightselected === "intermediate") {
                fileName = 'intermediate.txt'
            } else if (rightselected === "symtab") {
                fileName = 'symtab.txt'
            } else if (rightselected === "output") {
                fileName = 'output.txt'
            }
        }
        const text = localStorage.getItem(fileName)


        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: fileName,
                types: [{
                    description: 'Text Files',
                    accept: { 'text/plain': ['.txt'] },
                }],
            })

            const writable = await handle.createWritable()
            await writable.write(text)
            await writable.close()
        } catch (error) {
            console.error('Error saving file:', error)
        }
    })
})

document.querySelector('.reset-btn').addEventListener('click', async () => {
    const result = confirm('Do you want to clear both the files?')
    if (result) {
        document.querySelector('.left-box textarea').value = ""
        document.querySelector('.right-box textarea').value = ""
        localStorage.clear()

        document.querySelector('.left-box textarea').placeholder = "Write your " + leftselected + " code here"
        document.querySelector('.right-box textarea').placeholder = "Run the assembler to generate " + rightselected + " file"
    }
})

document.querySelector('.run-btn').addEventListener('click', async () => {
    try {
        const response = await fetch("/pass1", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: localStorage.getItem('input.txt'),
                optab: localStorage.getItem('optab.txt')
            })
        })

        if (response.ok) {
            const text = await response.json()
            localStorage.setItem('intermediate.txt', text.intermediate)
            localStorage.setItem('symtab.txt', text.symtab)
            localStorage.setItem('output.txt', text.output)

            if (rightselected === "intermediate")
                document.querySelector('.right-box textarea').value = text.intermediate
            else if (rightselected === "symtab")
                document.querySelector('.right-box textarea').value = text.symtab
            else if (rightselected === "output" && text.output !== "AUGEYSTOOOO")
                document.querySelector('.right-box textarea').value = text.output
        } else {
            if (response.status === 400) {
                alert("Input or Optab file missing")
            } else if (response.status === 505) {
                const text = await response.json()
                localStorage.setItem('intermediate.txt', text.intermediate)
                localStorage.setItem('symtab.txt', text.symtab)
                localStorage.setItem('output.txt', text.output)
                if (rightselected === "intermediate") {
                    document.querySelector('.right-box textarea').value = text.intermediate
                } else if (rightselected === "symtab") {
                    document.querySelector('.right-box textarea').value = text.symtab
                } else if (rightselected === "output") {
                    document.querySelector('.right-box textarea').value = ""
                    document.querySelector('.right-box textarea').placeholder = "Wrong input or optab."
                }
            } else {
                console.log("Couln't fetch pass 1.")
            }
        }
    } catch (err) {
        console.log(err)
    }
})