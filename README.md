# Tello Ecommerce Backend (REST API)

Tello Backend is a RESTful API built using Node.js, Express.js, MongoDB, and TypeScript. It provides the backend functionality for an ecommerce platform, including services for managing users, products, variants, authentication, shopping carts, and categories. The API utilizes various technologies such as Mongoose, Nodemailer, OAuth2.0 for Gmail authentication, and JWT for authentication purposes.

## Technologies Used

- **Node.js**: A JavaScript runtime environment that allows executing server-side JavaScript code.
- **Express.js**: A flexible and minimalist web application framework for Node.js that simplifies building robust APIs.
- **MongoDB**: A NoSQL document database for storing and managing data in a flexible, scalable, and efficient manner.
- **Mongoose**: An Object Data Modeling (ODM) library for MongoDB that provides a straightforward way to interact with the database.
- **TypeScript**: A typed superset of JavaScript that enhances developer productivity and improves code quality.
- **Nodemailer**: A module for Node.js that enables sending emails using various transport methods.
- **JWT (JSON Web Tokens)**: A compact and self-contained way of securely transmitting information between parties as a JSON object.
- **OAuth2.0**: An industry-standard authorization framework used to secure and authenticate users, allowing third-party applications to access their data.
- **Stripe**: A suite of APIs powering online payment processing and commerce solutions for internet businesses of all sizes. Accept payments and scale faster.

## Services

The backend API consists of the following services:

### 1. User Service

The User service handles user-related operations such as registration, login, updating user information, and retrieving user details. It provides endpoints for user authentication, user profile management, and user-related functionalities.

### 2. Product Service

The Product service is responsible for managing products. It allows creating new products, updating existing products, retrieving product information, and deleting products. This service provides endpoints for performing CRUD (Create, Read, Update, Delete) operations on products.

### 3. Variant Service

The Variant service handles product variants. It enables creating, retrieving, updating, and deleting variant information. Variants represent different options or versions of a product, such as size, color, or material. The service provides endpoints to manage the variant options available for each product.

### 4. Auth Service

The Auth service provides authentication functionality using OAuth2.0 for Gmail authentication and JWT for token-based authentication. It allows users to authenticate using their Gmail accounts, granting access to protected API endpoints. The service handles token generation, verification, and user authorization.

### 5. Cart Service

The Cart service manages shopping carts. It allows users to add products to their cart, update quantities, remove items, and retrieve cart details. The service provides endpoints to manipulate the contents of a user's shopping cart and calculate totals.

### 6. Category Service

The Category service handles the management of product categories. It enables creating new categories, updating existing categories, retrieving category information, and deleting categories. Categories are used to organize products into logical groups, making it easier for users to browse and search for products.

### 7. Checkout Service

Checkout Service handles purchace operations for items.

## Getting Started

To set up the Tello Ecommerce Backend, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/talehafandi/tello-backend.git
```

2. Install the dependencies:

```bash
cd tello-backend
npm install
```

3. Set up the environment variables:

Create a `.env` file in the root directory of the project and add the necessary environment variables. Refer to the `.env.example` file for the required variables.

4. Start the server:

```bash
npm run dev
```

The server will start running on `http://localhost:6006`.


## Acknowledgements

- [Node.js](https://nodejs.org)
- [Express.js](https://expressjs.com)
- [MongoDB](https://www.mongodb.com)
- [Mongoose](https://mongoosejs.com)
- [TypeScript](https://www.typescriptlang.org)
- [Nodemailer](https://nodemailer.com)
- [JWT](https://jwt.io)
- [OAuth2.0](https://oauth.net/2/)
- [Stripe](https://stripe.com/en-gb-us)

## Contact

For questions, feedback, or suggestions, you can reach us at talehafandi13@gmail.com or mention them in the 'issues' section.
