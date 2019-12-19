const fs = require('fs');
const pdf = require('pdf-parse');
 
let dataBuffer = fs.readFileSync('./test.pdf');
 
function render_page(pageData) {
  //check documents https://mozilla.github.io/pdf.js/
  let render_options = {
      //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
      normalizeWhitespace: false,
      //do not attempt to combine same line TextItem's. The default value is `false`.
      disableCombineTextItems: true,
      version: 'v2.0.550'
  }

  console.log('here')
  // console.log(pageData)
  pageData.getTextContent().then(text => console.log(text))

  return pageData.getTextContent(render_options)
  .then(function(textContent) {
    // console.log(JSON.stringify(textContent))
      let lastY, text = '';
      for (let item of textContent.items) {
          if (lastY == item.transform[5] || !lastY){
              text += item.str;
          }  
          else{
              text += '\n' + item.str;
          }    
          lastY = item.transform[5];
      }
      return text;
  });
}

let options = {
  pagerender: render_page
}

pdf(dataBuffer,options).then(function(data) {
  // console.log(data)
});