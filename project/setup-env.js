// Simple script to set up environment variables for Firebase
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Check if .env.local already exists
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  console.log('\x1b[33m%s\x1b[0m', 'WARNING: .env.local already exists. Running this script will overwrite it.');
  rl.question('Do you want to continue? (y/n): ', (answer) => {
    if (answer.toLowerCase() !== 'y') {
      console.log('Setup canceled.');
      rl.close();
      return;
    }
    beginSetup();
  });
} else {
  beginSetup();
}

function beginSetup() {
  console.log('\x1b[36m%s\x1b[0m', '\nFIREBASE CONFIGURATION SETUP\n');
  console.log('Please enter your Firebase configuration values:');
  console.log('(You can find these in your Firebase project settings)\n');

  const config = {
    VITE_FIREBASE_API_KEY: '',
    VITE_FIREBASE_AUTH_DOMAIN: '',
    VITE_FIREBASE_PROJECT_ID: '',
    VITE_FIREBASE_STORAGE_BUCKET: '',
    VITE_FIREBASE_MESSAGING_SENDER_ID: '',
    VITE_FIREBASE_APP_ID: '',
    VITE_FIREBASE_MEASUREMENT_ID: ''
  };

  const keys = Object.keys(config);
  let currentIndex = 0;

  function askForValue() {
    if (currentIndex >= keys.length) {
      // All values collected, write the file
      writeEnvFile();
      return;
    }

    const key = keys[currentIndex];
    rl.question(`${key}: `, (value) => {
      config[key] = value;
      currentIndex++;
      askForValue();
    });
  }

  function writeEnvFile() {
    let envContent = '# Firebase Configuration - DO NOT COMMIT THIS FILE TO GIT\n';
    for (const [key, value] of Object.entries(config)) {
      envContent += `${key}=${value}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('\x1b[32m%s\x1b[0m', '\nEnvironment file created successfully!');
    console.log('\x1b[33m%s\x1b[0m', 'IMPORTANT: Do not commit .env.local to git.');
    rl.close();
  }

  askForValue();
}

rl.on('close', () => {
  process.exit(0);
}); 