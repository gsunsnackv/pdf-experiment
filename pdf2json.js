let fs = require('fs'),
        PDFParser = require("pdf2json");
 
    let pdfParser = new PDFParser();
 
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
        console.log(JSON.stringify(pdfData));
    });
 
    pdfParser.loadPDF("./test.pdf");