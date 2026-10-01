import { getVietnameseName } from '../src/data/vietnamese.js';

const testCases = [
  'Epicranial aponeurosis.l',
  'Epicranial aponeurosis.r',
  'Platysma.l',
  'Frontalis',
  'Occipitalis.r',
  'Temporoparietal fascia.l',
  'Galea aponeurotica',
  'Lumbar vertebra',
  'Kidney.l',
  'Spleen',
  'Thoracic duct',
  'Superior vena cava'
];

console.log('Testing translation of test cases...');
testCases.forEach(tc => {
  console.log(`${tc} -> ${getVietnameseName(tc)}`);
});
