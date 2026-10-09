import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { CONSTITUENTS_DATABASE } from '../src/data/anatomyConstituents.js';

describe('Anatomy Constituents Mesh Linkage', () => {
  const systemsJsonPath = path.resolve(__dirname, '../public/data/systems.json');
  const systems = JSON.parse(fs.readFileSync(systemsJsonPath, 'utf8'));
  const allMeshes = new Set();
  Object.values(systems).forEach(meshList => {
    meshList.forEach(m => allMeshes.add(m.toLowerCase()));
  });

  it('all 82 constituents subparts have valid searchQuery matching real 3D meshes', () => {
    const broken = [];
    let checked = 0;

    for (const [key, category] of Object.entries(CONSTITUENTS_DATABASE)) {
      if (!category.subparts) continue;
      for (const sub of category.subparts) {
        checked++;
        const q = (sub.searchQuery || sub.name).toLowerCase();
        const found = allMeshes.has(q) || [...allMeshes].some(m => m.includes(q));
        if (!found) {
          broken.push({ parent: key, subName: sub.name, query: q });
        }
      }
    }

    expect(checked).toBe(82);
    expect(broken).toEqual([]);
  });
});
