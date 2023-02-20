const startOut = performance.now()
const pairFinderWorker = new Worker('PairExtractorWorker.js')

function shakeElement(element) {
    if (element.className === "shake") return
    element.setAttribute("class", "shake")
    setTimeout(() => element.removeAttribute("class", "flash-title"), 600)
    element.focus()
}

function statsTableBody(wordsList, titleString) {
    let row = document.querySelector("#statsBody").children[0]
    const totalPairsNumber = wordsList.reduce((total, current) => total + current.count, 0)

    row.children[0].innerText = "✖"
    row.children[1].innerText = titleString
    row.children[2].innerText = wordsList.length
    row.children[3].innerText = totalPairsNumber
    row.children[4].innerText = "👁"

    // const statsBody = document.getElementById("statsBody")
    // const totalPairsNumber = wordsList.reduce((total, current) => total + current.count, 0)
    // const rowHtml =       document.createElement("tr")
    // const remove =        document.createElement("td")
    // const title =         document.createElement("td")
    // const uniquePairs =   document.createElement("td")
    // const totalPairs =    document.createElement("td")
    // const view =          document.createElement("td")

    // remove.innerText = "✖"
    // title.innerText = titleString
    // uniquePairs.innerText = wordsList.length
    // totalPairs.innerText = totalPairsNumber
    // view.innerText = "👁"
    // rowHtml.append(remove, title, uniquePairs, totalPairs, view)
    // statsBody.append(rowHtml)

}
// for testing the memory only.
function createEmptyBody(tableBody){
    for (let i = 0; i < 100000; i++) {
        const rowHtml = document.createElement("tr")
        const position = document.createElement("td")
        const count = document.createElement("td")
        const a = document.createElement("td")
        const b = document.createElement("td")
        rowHtml.append(position, count, a, b)
        tableBody.append(rowHtml)     
    }
}

function createTableBody(wordsList, tableBody) {
    for (const [index, value] of wordsList.entries()) {
        const rowHtml = document.createElement("tr")
        const position = document.createElement("td")
        const count = document.createElement("td")
        const a = document.createElement("td")
        const b = document.createElement("td")

        position.innerText = index + 1
        count.innerText = value.count
        a.innerText = value.a
        b.innerText = value.b
        rowHtml.append(position, count, a, b)
        tableBody.append(rowHtml)
    }
}

function wordsTableBody(wordsList) {
    wordsList = wordsList.slice(0,1000)
    let tableBody = document.createElement("tbody")
    let wordsTable = document.querySelector("#wordsTable")
    createTableBody(wordsList, tableBody)
    // createEmptyBody(tableBody)  //for testing memory only
    wordsTable.children[1].remove()
    wordsTable.append(tableBody)
}

let text = ""
let title = ""
let start

document.querySelector("input").addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        e.preventDefault()
        document.querySelector('#button').click()
    }
})
pairFinderWorker.addEventListener('message', pairsList => {
    statsTableBody(pairsList.data, title)
    wordsTableBody(pairsList.data)
    console.log(`${title} took ${((performance.now() - start) / 1000).toFixed(2)} seconds to analyze.`)
    start = performance.now()
})

button.addEventListener("click", e => {
    start = performance.now()
    title = document.querySelector("#title")
    text = document.querySelector("#textArea")
    if (title.value === "") return shakeElement(title)
    if (text.value === "") return shakeElement(text)
    title = title.value
    text = text.value
    document.querySelector("#textArea").value = ""
    document.querySelector("#title").value = ""
    pairFinderWorker.postMessage(text)
})









