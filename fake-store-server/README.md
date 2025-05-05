# Fake Store Server

## Overview

`fake-store-server` is a RESTful API server designed to support the `fake-store` React Native application. It simulates backend functionalities for an e-commerce platform, including user management, product browsing, and order processing.

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

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
