import * as path from 'path';
import * as fs from 'fs';
import {parse} from '@iarna/toml';

const DATA = path.join(__dirname, '../data');

const outDir = process.argv[2];

const warnings = [];

const data = [];

for (const name of fs.readdirSync(DATA)) {
  const dir = path.join(DATA, name);
  if (!fs.existsSync(path.join(dir, 'metadata.toml'))) {
    warnings.push(`Directory ${dir} is missing a metadata.toml file. Skipping.`)
    continue;
  }

  if (!fs.existsSync(path.join(dir, 'bio.txt'))) {
    warnings.push(`Directory ${dir} is missing a bio.txt file. Skipping.`)
    continue;
  }

  let metadata: {name: string, sources: string[]};
  try {
    const parsed = parse(fs.readFileSync(path.join(dir, 'metadata.toml'), 'utf-8')) as {[key: string]: unknown};
    if (typeof parsed.name !== 'string') {
      throw new Error('Expected "name" to be a string.')
    }
    if (!Array.isArray(parsed.sources) || parsed.sources.some(item => {
      return !item || (typeof item.name !== 'string') || (typeof item.url !== 'string')
    })) {
      throw new Error('Expected "sources" to be an array of name, url pairs.')
    }

    metadata = {
      name: parsed.name,
      sources: parsed.sources
    };
  } catch (e) {
    warnings.push(`Error parsing ${dir}/metadata.toml: ${e.message}`);
    continue;
  }

  const bio = fs.readFileSync(path.join(dir, 'bio.txt'), 'utf-8');

  data.push({
    ...metadata,
    bio
  });
}

data.sort((a, b) => a.name.localeCompare(b.name));

if (outDir) {
  fs.writeFileSync(path.join(outDir, 'mathematicians.json'), JSON.stringify(data, null, 2));
  fs.writeFileSync(path.join(outDir, 'mathematicians.ts'), `
export default [
  ${data.map(item => JSON.stringify(item)).join(`,
  `)}
];
`);
} else {
  console.log(JSON.stringify(data, null, 2));
}

for (const warning of warnings) {
  console.error(warning);
}
