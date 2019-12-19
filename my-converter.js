const fs = require('fs')
const pdf2json = require("pdf2json");
 
const parsePdfAsync = async (file) => {
  const parsePromise = new Promise((resolve, reject) => {
    const pdfParser = new pdf2json();
    pdfParser.on("pdfParser_dataError", errData => {
      reject(errData.parserError)
    });
    pdfParser.on("pdfParser_dataReady", pdfData => {
        resolve(pdfData);
    });
    pdfParser.loadPDF(file);
  })  
  return parsePromise
}

const main = async () => {
  let data
  try{
    data = await parsePdfAsync("./test.pdf")
  }
  catch(e){
    console.log('Exception when parse pdf: ', e)
    return
  }
  // console.log(data)
  // console.log(JSON.stringify(data))
  const pages = data.formImage.Pages
  const page0 = pages[0]
  const texts = page0.Texts
  const paragraphs = []
  let paragraph = []
  let lastY = 0
  for (const text of texts) {
    const textRs = text.R
    const spans = []
    let firstChar
    for (const textR of textRs) {
      const textT = textR.T
      const decoded = decodeURIComponent(textT)
      if (!firstChar) {
        const letterMatch = decoded.match(/[a-zA-Z]/)
        firstChar = letterMatch ? letterMatch.pop() : 'A'
      }

      const textStyle = textR.TS
      const fontSize = textStyle[1]
      const fontWeight = textStyle[2] === 1 ? 'bold' : 'normal'
      const fontStyle = textStyle[3] === 1 ? 'italic' : 'normal'
      const span = `<span style="font-size:${fontSize};font-weight:${fontWeight};font-style:${fontStyle}">${decoded}</span>`
      spans.push(span)
    }
    // console.log(firstChar)
    // console.log(spans)

    const y = text.y
    // same line so same paragraph
    if (y === lastY) {
      paragraph = paragraph.concat(spans)
      continue
    }
    // // new line
    lastY = y

    // consider lower case indicate we are in the same paragraph
    if (firstChar === firstChar.toLowerCase()) {
      paragraph = paragraph.concat(spans)
      continue
    }

    const paragraphStr = '<p>' + paragraph.join('') + '</p>'
    paragraphs.push(paragraphStr)
    paragraph = []
    paragraph = paragraph.concat(spans)
  }
  const paragraphStr = '<p>' + paragraph.join('') + '</p>'
  paragraphs.push(paragraphStr)

  const bodyStr = paragraphs.join('')
  const html = `<html><head></head><body>${bodyStr}</body></html>`

  fs.writeFileSync('./my-converter.html', html)
}

main()
