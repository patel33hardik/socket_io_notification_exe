# Mns-alerting App

This project is an Electron application that connects to a Socket.io server to receive real-time announcements. It features a Bootstrap modal for configuring connection settings, displays a connection status, and shows emergency broadcasts.

## Project Structure
```bash
mns-alerting/
│
├── main.js                # Main process script
├── preload.js             # Preload script for security and context bridge
├── index.html             # Main HTML file
├── package.json           # Project metadata and dependencies
├── settings.json          # Configuration file for Socket.io settings (created on first run)
└── styles.css             # Custom styles for the application
```

## Features

- Connects to a Socket.io server based on user-defined settings.
- Displays the connection status (Connected/Disconnected).
- Shows emergency broadcast messages in real-time.
- Provides a Bootstrap modal to update Socket.io server settings.

## Requirements

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/) (Node package manager, comes with Node.js)
- [Electron](https://www.electronjs.org/) (To run the application)

## Getting Started

Follow these instructions to set up the project locally.

### 1. Clone the Repository and run following commands.

```bash
npm install
npm start

