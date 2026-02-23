// Poseidon Automated Testing and Deployment
// Professional, robust, and extensible

import { exec } from 'child_process';

export function runAutomatedTests(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec('npm test', (error, stdout, stderr) => {
      if (error) reject(stderr);
      else resolve(stdout);
    });
  });
}

export function deployApplication(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec('npm run deploy', (error, stdout, stderr) => {
      if (error) reject(stderr);
      else resolve(stdout);
    });
  });
}

// Example usage:
// runAutomatedTests().then(console.log);
// deployApplication().then(console.log);
