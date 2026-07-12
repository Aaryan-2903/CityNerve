/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'data/mockIncidents.ts',
  'data/mockResources.ts',
  'data/mockAIBriefing.ts',
  'src/data/mockIncidents.ts',
  'src/data/mockResources.ts',
  'src/data/mockAIBriefing.ts',
  'data/simulationScenario.ts'
];

const replacements = [
  { rx: /\bNew York City\b/g, replacement: 'Mumbai' },
  { rx: /\bNew York\b/g, replacement: 'Mumbai' },
  { rx: /\bNYC\b/g, replacement: 'Mumbai' },
  { rx: /\bNY\b/g, replacement: 'MH' },
  { rx: /\bManhattan\b/g, replacement: 'South Mumbai' },
  { rx: /\bBrooklyn\b/g, replacement: 'Andheri' },
  { rx: /\bQueens\b/g, replacement: 'Kurla' },
  { rx: /\bBronx\b/g, replacement: 'Thane' },
  { rx: /\bStaten Island\b/g, replacement: 'Navi Mumbai' },
  { rx: /\bMidtown Manhattan\b/g, replacement: 'BKC' },
  { rx: /\bMidtown\b/g, replacement: 'BKC' },
  { rx: /\bGrand Central Terminal\b/g, replacement: 'CSMT' },
  { rx: /\bGrand Central\b/g, replacement: 'Dadar Station' },
  { rx: /\bRed Hook\b/g, replacement: 'Dharavi' },
  { rx: /\bFDNY\b/g, replacement: 'Mumbai Fire Brigade' },
  { rx: /\bNYPD\b/g, replacement: 'Mumbai Police' },
  { rx: /\bNWS\b/g, replacement: 'IMD' },
  { rx: /\bNYC EMS\b/g, replacement: 'BMC EMS' },
  { rx: /\bNYC DOT\b/g, replacement: 'MMRDA' },
  
  // Specific streets/places
  { rx: /\b6th Avenue\b/g, replacement: 'Linking Road' },
  { rx: /\bDelancey Street\b/g, replacement: 'S.V. Road' },
  { rx: /\bFDR Drive\b/g, replacement: 'Western Express Highway' },
  { rx: /\bQueensboro Bridge\b/g, replacement: 'Bandra-Worli Sea Link' },
  { rx: /\bUnion Square Park\b/g, replacement: 'Shivaji Park' },
  { rx: /\bRed Hook Container Terminal\b/g, replacement: 'MbPT Docks' },
  { rx: /\bW 31st St\b/g, replacement: 'LBS Marg' },
  { rx: /\bE 51st St\b/g, replacement: 'Annie Besant Road' },
  { rx: /\bE 42nd St\b/g, replacement: 'SV Road' },
  { rx: /\bColumbia St\b/g, replacement: 'JVLR' },
  { rx: /\bWilliamsburg Bridge\b/g, replacement: 'Vashi Bridge' },
  { rx: /\b6th Ave & 48th St\b/g, replacement: 'Sion Circle' },
  { rx: /\bVanderbilt Ave\b/g, replacement: 'Tulsi Pipe Road' },
  { rx: /\bAtlantic Ave\b/g, replacement: 'Eastern Express Highway' },
  { rx: /\bE 14th St\b/g, replacement: 'Cadel Road' },
  { rx: /\bEast River\b/g, replacement: 'Mithi River' },

  // Specific incidents
  { rx: /Multi-Structure Fire/g, replacement: 'Building Collapse' },
  { rx: /Mass Casualty Event/g, replacement: 'Flooded Subway' },
  { rx: /Chemical Hazmat Spill/g, replacement: 'Chemical Leak' },
  { rx: /Bridge Structural Failure/g, replacement: 'Bridge Closure' },
  { rx: /Severe Flooding/g, replacement: 'Waterlogging' }
];

filesToProcess.forEach(relPath => {
  const fullPath = path.join(__dirname, relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let original = content;
    replacements.forEach(({ rx, replacement }) => {
      content = content.replace(rx, replacement);
    });
    if (content !== original) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated ${relPath}`);
    }
  }
});

console.log("Localization complete.");
