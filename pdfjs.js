const fs = require('fs');
const PDFJS = require(`./pdfjs-2.3.200-dist/build/pdf.js`);

const main = async () => {
  let dataBuffer = fs.readFileSync('./test.pdf');
  let doc = await PDFJS.getDocument(dataBuffer);
  // console.log('doc')
  // console.log(doc)
  const page0 = await doc.getPage(1)
  // console.log('page0')
  // console.log(page0)
  const textContent = await page0.getTextContent()
  console.log('textContent')
  console.log(JSON.stringify(textContent))

  // const operatorList = await page0.getOperatorList()
  // console.log('operatorList')
  // console.log(JSON.stringify(operatorList))
}

main()

