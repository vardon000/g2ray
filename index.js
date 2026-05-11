const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define log directory and file
const logDir = path.join(__dirname, 'log');
const logFile = path.join(logDir, 'log.log');

// Ensure the log directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Define the command to execute the installation script
// The script is located in the .devcontainer folder
const scriptPath = path.join(__dirname, '.devcontainer', 'install.sh');
const command = `sh ${scriptPath}`;

// Open a write stream to the log file
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Log start time
const startTime = new Date().toISOString();
logStream.write(`[${startTime}] Starting installation script...\n`);
console.log(`[${startTime}] Starting installation script...`);

// Execute the shell script
const childProcess = exec(command);

// Capture stdout and stderr and write to both console and log file
childProcess.stdout.on('data', (data) => {
    logStream.write(data);
    console.log(data);
});

childProcess.stderr.on('data', (data) => {
    logStream.write(`ERROR: ${data}`);
    console.error(`ERROR: ${data}`);
});

// Handle process completion
childProcess.on('close', (code) => {
    const endTime = new Date().toISOString();
    const logMessage = `[${endTime}] Process exited with code ${code}\n`;
    logStream.write(logMessage);
    console.log(logMessage);
    logStream.end();

    if (code !== 0) {
        console.error(`Installation script failed with exit code ${code}. Check ${logFile} for details.`);
        process.exit(code);
    } else {
        console.log(`Installation script completed successfully. Full log saved to ${logFile}.`);
        // After successful installation, you can add code to read/display the VLESS link if applicable
        // For example, reading the terminal output that contains the link.
        // In a GitHub Actions context, you might want to output the link for the next step.
    }
});

// Handle potential errors in spawning the process
childProcess.on('error', (err) => {
    const errorTime = new Date().toISOString();
    const errorMessage = `[${errorTime}] Failed to start process: ${err.message}\n`;
    logStream.write(errorMessage);
    console.error(errorMessage);
    logStream.end();
    process.exit(1);
});
