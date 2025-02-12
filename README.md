# Marketplace Platform

A minimal marketplace platform built with **Node.js**, **Express**, **MongoDB**, and **Docker**.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Running Tests](#running-tests)
- [Figma Integration](#figma-integration)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Overview
This project provides a basic structure for a marketplace platform with authentication, a database connection, and a modular structure for scalability.

## Features
- **User Authentication** with JWT
- **MongoDB** for database management
- **Express.js** as a backend framework
- **Docker** support for easy deployment
- **Jest** for unit testing
- **Figma Integration** for UI/UX design collaboration

## Installation
Ensure you have **Node.js v14+** and **Docker** installed.

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/marketplace-platform.git
   cd marketplace-platform
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables in `.env` (see below).

## Environment Variables
Create a `.env` file in the root directory and add the following:
```env
MONGODB_URI=mongodb://mongo:27017/marketplace
JWT_SECRET=your-secret-key
```

## Running the Project
To run the project locally using Docker:
```sh
docker-compose up --build
```
Or start it with Node.js:
```sh
npm start
```
The server runs on **http://localhost:3000**.

## Running Tests
To execute tests, run:
```sh
npm test
```
Or with Docker:
```sh
docker-compose -f docker-compose.test.yml up --build
```

## Figma Integration
Our UI/UX design is maintained in **Figma**. To access the latest designs:
- Visit: [Figma Marketplace UI/UX](https://www.figma.com/file/your_figma_file)
- Collaborate with the design team by leaving comments on Figma.
- Sync changes using the **Figma API** for automated updates.

For developers, clone the Figma design assets using:
```sh
npm install -g figma-export
figma-export --file your_figma_file --output ./assets
```

## API Endpoints
- **`POST /auth/signup`** - Register a new user
- **`POST /auth/login`** - Authenticate a user
- **`GET /products`** - Retrieve product listings
- **`POST /products`** - Add a new product

## License
This project is licensed under the [MIT License](LICENSE).

