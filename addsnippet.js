const fs = require('fs');
const path = require('path');

const ID = unescape(process.env.ID);
const VISIBILITY = unescape(process.env.VISIBILITY);
const MODE = unescape(process.env.MODE);
const TITLE = unescape(process.env.TITLE);
const CONTENTS = unescape(process.env.CONTENTS);

if (VISIBILITY !== "public" && VISIBILITY !== "unlisted") {
  console.error("Visibility must be public or unlisted");
  process.exit(1);
}

if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(ID)) {
  console.error("ID must be a valid GUID");
  process.exit(1);
}

const output = `---
name: ${TITLE.replace(/\n/g, ' ')}
mode: ${MODE.replace(/\n/g, '')}
date: ${new Date().toISOString()}
---
${CONTENTS}
`;

const fileName = path.join(__dirname, '_' + VISIBILITY, ID + '.md');
fs.writeFileSync(fileName, output);
console.log(`Write file: ${fileName}`);