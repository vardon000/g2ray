const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Log directory and file
const logDir = path.join(__dirname, 'log');
const logFile = path.join(logDir, 'log.log');

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Path to the original install script
const scriptPath = path.join(__dirname, '.devcontainer', 'install.sh');

// Command: "yes |" automatically answers 'y' to every prompt (acts like -y globally)
const command = `yes | sh ${scriptPath}`;

const logStream = fs.createWriteStream(logFile, { flags: 'a' });

const startTime = new Date().toISOString();
logStream.write(`[${startTime}] Starting installation with auto-yes...\n`);
console.log(`[${startTime}] Starting installation with auto-yes...`);

const childProcess = exec(command);

childProcess.stdout.on('data', (data) => {
    logStream.write(data);
    console.log(data);
});

childProcess.stderr.on('data', (data) => {
    logStream.write(`ERROR: ${data}`);
    console.error(`ERROR: ${data}`);
});

childProcess.on('close', (code) => {
    const endTime = new Date().toISOString();
    const logMessage = `[${endTime}] Process exited with code ${code}\n`;
    logStream.write(logMessage);
    console.log(logMessage);
    logStream.end();

    if (code !== 0) {
        console.error(`Installation failed with exit code ${code}. Check ${logFile}`);
        process.exit(code);
    } else {
        console.log(`Installation successful. Full log saved to ${logFile}`);
    }
});

childProcess.on('error', (err) => {
    const errorTime = new Date().toISOString();
    const errorMessage = `[${errorTime}] Failed to start process: ${err.message}\n`;
    logStream.write(errorMessage);
    console.error(errorMessage);
    logStream.end();
    process.exit(1);
});
