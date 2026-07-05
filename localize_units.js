const fs = require('fs');

const file = 'data/simulationScenario.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace inches with mm and scale up
content = content.replace(/(\d+\.\d+|\d+) in\/hr/g, (match, p1) => {
  return Math.round(parseFloat(p1) * 25.4) + ' mm/hr';
});

fs.writeFileSync(file, content, 'utf8');

const incFiles = ['data/mockIncidents.ts', 'src/data/mockIncidents.ts'];
incFiles.forEach(f => {
  if(fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    c = c.replace(/2 inches/g, '50 mm');
    fs.writeFileSync(f, c, 'utf8');
  }
});

console.log("Units localized");
