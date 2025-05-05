# Fake Store Server

## Overview

`fake-store-server` is a RESTful API server designed to support the `fake-store` React Native application for the Mobile Application Development (MAD) course. It simulates backend functionalities for an e-commerce platform, including user management, product browsing, and order processing.

## Objective

The purpose of this server is to provide MAD course students with a real-world experience of interacting with backend APIs. Students will learn how to connect a React Native app to a backend server, handle API requests, manage user authentication, and perform CRUD operations.

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm

### Setup

1. **Clone the Repository**: Clone this repository to your local machine.

   ```bash
   git clone https://github.com/LarryAtGU/fake-store-server.git
   cd fake-store-server
   ```

2. **Install Dependencies**: Install the necessary npm packages.

   ```bash
   npm install
   ```

3. **Test APIs**: To test if all api endpoint and SQLight Database works.

   ```bash
   npm test
   ```

4. **Start the Server**: Launch the server on your local machine.

   ```bash
   npm start
   ```

The server will start running on `http://localhost:3000/`. Adjust the port in the configuration if necessary.

## Features

- **User Authentication**: Endpoints for user signup, signin, and profile management.
- **Product Management**: Retrieve the list of products available in the fake store.
- **Order Processing**: Create and manage orders for the authenticated user.

## API Documentation

For detailed API endpoints and their specifications, please refer to the Swagger/OpenAPI documentation available at `http://localhost:3000/api-docs` after starting the server.

## Debug Endpoints

This server includes debug endpoints (`/users` and `/orders`) for educational purposes. These endpoints are not protected and should not be used in production or the `fake-store` client app.

## Assignment Integration

Students are expected to integrate their `fake-store` React Native app with this server to complete the assignment tasks. Ensure to configure the app to point to the correct server URL.

## Submission Guidelines for Students

Students should focus on the client-side development of the `fake-store` app, consuming the APIs provided by `fake-store-server`. The server is provided as-is for the assignment and does not require modifications.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
