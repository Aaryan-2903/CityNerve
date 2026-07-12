/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const files = [
  'data/mockIncidents.ts',
  'data/mockResources.ts',
  'src/data/mockIncidents.ts',
  'src/data/mockResources.ts'
];

const latDelta = -21.6368;
const lngDelta = 146.8837;

files.forEach(relPath => {
  const fullPath = path.join(__dirname, relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace lat
    content = content.replace(/lat:\s*(40\.\d+)/g, (match, p1) => {
      let newLat = (parseFloat(p1) + latDelta).toFixed(4);
      return `lat: ${newLat}`;
    });

    // Replace lng
    content = content.replace(/lng:\s*(-7[34]\.\d+)/g, (match, p1) => {
      let newLng = (parseFloat(p1) + lngDelta).toFixed(4);
      return `lng: ${newLng}`;
    });

    fs.writeFileSync(fullPath, content, 'utf8');
  }
});
console.log('Coordinates localized to Mumbai.');
