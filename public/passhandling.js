let leftselected, rightselected, side

document.addEventListener('DOMContentLoaded', async () => {
    leftselected = "input"
    rightselected = "intermediate"
    document.querySelector('.input-btn').click()
    document.querySelector('.intermediate-btn').click()
})

document.querySelector('.input-btn').addEventListener('click', async () => {
    let text
    try {
        text = await contentFetcher("optab.txt")
        // console.log(text)
        if (document.querySelector('.left-box textarea').value !== text && leftselected === "optab") {
            const result = confirm('You have unsaved changes. Do you want to save them?')
            if (result) {
                document.querySelector('.leftsave').click()
            } else {
                return
            }
        }
    } catch (err) {
        console.error(err)
    }

    document.querySelector('#lname').textContent = "Input File";
    leftselected = "input"
    document.querySelector('.input-btn').style.backgroundColor = "#38405c"
    document.querySelector('.optab-btn').style.backgroundColor = "#44475a"
    try {
        text = await contentFetcher("input.txt")
        if (text === "") {
            throw new Error('File not found')
        }
        document.querySelector('.left-box textarea').value = text
    } catch (err) {
        document.querySelector('.left-box textarea').value = ""
        document.querySelector('.left-box textarea').placeholder = "Write your input code here"
    }
})
document.querySelector('.optab-btn').addEventListener('click', async () => {
    let text
    try {
        text = await contentFetcher("input.txt")
        if (document.querySelector('.left-box textarea').value !== text && leftselected === "input") {
            const result = confirm('You have unsaved changes. Do you want to save them?')
            if (result) {
                document.querySelector('.leftsave').click()
            } else {
                return
            }
        }
    } catch (err) {
        console.error(err)
    }

    document.querySelector('#lname').innerHTML = "Optab File"
    leftselected = "optab"
    document.querySelector('.optab-btn').style.backgroundColor = "#38405c"
    document.querySelector('.input-btn').style.backgroundColor = "#44475a"
    try {
        text = await contentFetcher("optab.txt")
        if (text === "") {
            throw new Error('File not found')
        }
        document.querySelector('.left-box textarea').value = text
    } catch (err) {
        document.querySelector('.left-box textarea').value = ""
        document.querySelector('.left-box textarea').placeholder = "Write your optab here"
    }
})

document.querySelector('.intermediate-btn').addEventListener('click', async () => {
    document.querySelector('#rname').innerHTML = "Intermediate File"
    rightselected = "intermediate"
    document.querySelector('.intermediate-btn').style.backgroundColor = "#38405c"
    document.querySelectorAll('.symtab-btn, .output-btn').forEach((btn) => {
        btn.style.backgroundColor = "#44475a"
    })

    try {
        text = await contentFetcher("intermediate.txt")
        if (text === "") {
            throw new Error('File not found')
        }
        document.querySelector('.right-box textarea').value = text
    } catch (err) {
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

    try {
        text = await contentFetcher("symtab.txt")
        if (text === "") {
            throw new Error('File not found')
        }
        document.querySelector('.right-box textarea').value = text
    } catch (err) {
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

    try {
        text = await contentFetcher("output.txt")
        if (text === "") {
            throw new Error('File not found')
        }
        document.querySelector('.right-box textarea').value = text
    } catch (err) {
        document.querySelector('.right-box textarea').value = ""
        document.querySelector('.right-box textarea').placeholder = "Run the assembler to generate output file"
    }
})

async function contentFetcher(filename) {
    try {
        const response = await fetch("/download/" + filename);
        if (response.ok) {
            return await response.text();
        } else {
            throw new Error('File not found');
        }
    } catch (err) {
        throw err
    }
}

document.getElementById('editButton').addEventListener('click', function () {
    const textarea = document.querySelector('.left-box textarea')
    textarea.removeAttribute('readonly')
    textarea.focus()
})

document.querySelector('.left-box textarea').addEventListener('blur', function () {
    this.setAttribute('readonly', true)
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

    const blob = new Blob([content], { type: 'text/plain' })
    const formData = new FormData()
    formData.append('file', blob, fileName)

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        })
        if (response.ok) {
            alert('File uploaded successfully')
        } else {
            alert('Error uploaded file')
        }
    } catch (err) {
        console.error("Error uploading file: ", err)
    }
})

document.querySelector('.left-download').addEventListener('click', async function () {
    side = "left"
})
document.querySelector('.right-download').addEventListener('click', async function () {
    side = "right"
})
document.querySelectorAll('.download').forEach(element => {
    element.addEventListener('click', async function () {
        let filename
        if (side === "left") {
            leftselected === "input" ? filename = 'input.txt' : filename = 'optab.txt'
        } else if (side === "right") {
            if (rightselected === "intermediate") {
                filename = 'intermediate.txt'
            } else if (rightselected === "symtab") {
                filename = 'symtab.txt'
            } else if (rightselected === "output") {
                filename = 'output.txt'
            }
        }
        console.log(filename + " downloaded")

        // try {
        //     const result = await fetch('download/' + filename)
        //     if (!result.ok) {
        //         throw new Error('Error downloading file')
        //     }
        //     const blob = await result.blob()
        //     const url = URL.createObjectURL(blob)
        //     const a = document.createElement('a')
        //     a.href = url
        //     a.download = filename
        //     a.click()
        //     a.remove()
        //     URL.revokeObjectURL(url)
        // } catch (err) {
        //     console.error('Error downloading file:', err)
        // }

        try {
            const response = await fetch('/download/' + filename, { method: 'HEAD' });
            if (response.ok) {
                window.location.href = '/download/' + filename;
            } else {
                alert('File not found bro');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred.');
        }
    })
})

document.querySelector('.reset-btn').addEventListener('click', async () => {
    const result = confirm('Do you want to clear both the files?')
    if (result) {
        document.querySelector('.left-box textarea').value = ""
        document.querySelector('.right-box textarea').value = ""
        const result = await fetch('/reset')

        document.querySelector('.left-box textarea').placeholder = "Write your" + leftselected + "code here"
        document.querySelector('.right-box textarea').placeholder = "Run the assembler to generate" + rightselected + "file"
    }
})

document.querySelector('.run-btn').addEventListener('click', async () => {
    try {
        const response = await fetch("/pass1")
        if (response.ok) {
            const text = await response.json()

            if (rightselected === "intermediate")
                document.querySelector('.right-box textarea').value = text.intermediate
            else if (rightselected === "symtab")
                document.querySelector('.right-box textarea').value = text.symtab
            else if (rightselected === "output" && text.output !== "AUGEYSTOOOO")
                document.querySelector('.right-box textarea').value = text.output
        } else {
            if (response.status === 400) {
                alert("Input or Optab file missing")
            } else if (response.status === 502) {
                if (rightselected === "output"){
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