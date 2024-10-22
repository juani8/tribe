# Tribe Backend

Welcome to the Tribe Backend! This project is built with JavaScript, Express, Node.js, and MongoDB.

## Table of Contents

- [Installation](#installation)
- [Folder Structure](#folder-structure)
- [Connection to Database](#connection-to-database)
    - [Connecting to the local MongoDB Database](#connecting-to-the-local-mongodb-database)
    - [Connecting to the MongoDB Atlas Database](#connecting-to-the-mongodb-atlas-database)
- [Running the Application](#running-the-application)
- [Mailtrap + Postman Guides](#mailtrap--postman-guides)
    - [Setting Up Mailtrap](#setting-up-mailtrap)
    - [Using Mailtrap and Postman with Registration, Magic Link Verification, and Login](#using-mailtrap-and-postman-with-registration-magic-link-verification-and-login)
    - [Using Mailtrap and Postman with Password Reset, Magic Link Verification, and Password Change](#using-mailtrap-and-postman-with-password-reset-magic-link-verification-and-password-change)
    - [Setting Environment Variables in Postman](#setting-environment-variables-in-postman)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/mrosariopresedo/Tribe.git
    ```

2. Navigate to the project directory:

    ```bash
    cd TribeBackend
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

## Folder Structure

```yaml
├── TribeBackend                      # Root folder for the backend application
│   ├── controllers/                  # Contains controller files that handle requests and responses
│   │   ├── authController.js         # Controller for authentication-related operations (e.g., login, registration)
│   │   └── userController.js         # Controller for user-related operations (e.g., user profile, updates)
│   ├── middlewares/                  # Contains middleware functions that process requests before reaching the routes
│   │   └── auth.js                   # Middleware to check user authentication (e.g., verifying JWT tokens)
│   ├── models/                       # Contains data models that define the structure of the database documents
│   │   ├── User.js                   # User model representing user data in the database
│   │   └── Post.js                   # Post model representing posts made by users in the database
│   ├── routes/                       # Contains route files that define API endpoints and their corresponding controllers
│   │   ├── authRoutes.js             # Routes for authentication-related endpoints (e.g., login, register)
│   │   └── userRoutes.js             # Routes for user-related endpoints (e.g., user profile, updates)
│   └── server                        # Contains server-related configuration and setup files
│   │   ├── app.js                    # Main application file where Express app is initialized and configured
│   │   ├── db.js                     # Database connection setup (e.g., connecting to MongoDB)
│   │   └── index.js                  # Entry point of the application that starts the server
│   └── utils                         # Contains utility functions that can be reused across the application
│   │   └── magicLink.js              # Functionality for generating and handling magic links for authentication
├── ├── .env                          # Environment variables file for storing sensitive information (e.g., database URL, JWT secret)
├── ├── package.json                  # Project configuration file that lists dependencies and scripts for the application
└── ├── README.md                     # Documentation file for the project, explaining how to set up and use the application
```

## Connection to Database

---

### Connecting to the Local MongoDB Database

---

#### Step 1: Set Up Environment Variables

Locate the `.env` file in the root directory of the project. Ensure it contains the following lines:

```ruby
MONGODB_URI=mongodb://localhost:27017/local_database_name
JWT_SECRET=long_key
```

Replace `local_database_name` with the name you assigned to your local MongoDB database during its creation.

For the `JWT_SECRET`, this is a secret key used for signing JSON Web Tokens (JWTs) to ensure secure authentication. You can generate a strong, random string to use as your secret. It is recommended to keep this key confidential and store it securely. You can create one using a password manager or online password generator, or you can simply use a long string of random characters.

---

#### Step 2: Configure Database Connection in `db.js`

Navigate to the `db.js` file located in the `server` folder of the project. Ensure that it includes the following code:

```ruby
require('dotenv').config(); // Ensure environment variables are loaded
const mongoose = require('mongoose');

// Replace with your actual MongoDB URI
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
```

#### Step 3: Run the Application

Run `npm start` from the `TribeBackend` directory. You should receive a message saying "Connected to MongoDB".

---

### Connecting to the MongoDB Atlas Database

---

#### Step 1: Set Up Environment Variables

Navigate to the `.env` file located in the root folder of the project. Ensure that it contains the following lines:

```ruby
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@tribe.efseo.mongodb.net/?retryWrites=true&w=majority&appName=TRIBE
JWT_SECRET=long_key
```

In the first line, replace `<db_username>` and `<db_password>` with your actual MongoDB Atlas credentials.

For the `JWT_SECRET`, this is a secret key used for signing JSON Web Tokens (JWTs) to ensure secure authentication. You can generate a strong, random string to use as your secret. It is recommended to keep this key confidential and store it securely. You can create one using a password manager or online password generator, or you can simply use a long string of random characters.

---

#### Step 2: Configure Database Connection in `db.js`

Navigate to the `db.js` file located in the `server` folder of the project. Ensure that it includes the following code:

```ruby
require('dotenv').config({ path: '../.env' });
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not defined in the .env file');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connection() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = connection;
```

#### Step 3: Execute the Connection Script

Run `npm start` from the `TribeBackend` directory. You should receive a message saying “Pinged your deployment. You successfully connected to MongoDB!”

---

## Running the Application

To start the application, use the following command:

```bash
npm start
```

## Mailtrap + Postman Guides

### Setting Up Mailtrap

Mailtrap is a tool used for email testing, especially in development environments. Here’s how you can verify if the magic link email was sent correctly.

#### 1. Sign Up for a Mailtrap Account:

Go to [Mailtrap](https://mailtrap.io/) and create an account (free plans are available).

#### 2. Set Up an Inbox

- After logging in, you’ll see an option to create a **new inbox** (called a "mailbox" in Mailtrap).
- Click **"Add Mailbox"** and give it a name (e.g., `Tribe Auth Emails`).

#### 3. Get SMTP Credentials:

- After setting up the inbox, Mailtrap will provide you with **SMTP credentials** (host, port, username, password).
- Go to the **"Integrations"** tab in the Mailtrap dashboard, and you’ll see something like:

    ```yaml
    SMTP Host: smtp.mailtrap.io
    SMTP Port: 2525
    Username: your_mailtrap_user
    Password: your_mailtrap_password
    ```

#### 4. Update `magicLink.js` in the Project:

- In your `magicLink.js` file, ensure you are using the Mailtrap credentials:

```jsx
let transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'your_mailtrap_user',  // Mailtrap username
    pass: 'your_mailtrap_password'  // Mailtrap password
  }
});
```

#### 5. Send a Magic Link:

- When you test your password reset or registration functionality, Mailtrap will capture the outgoing emails.

#### 6. Check Your Mailtrap Inbox:

- Go back to your **Inbox** (Mailbox) in Mailtrap and look for the emails that were sent from your application.
- You should see an email with the magic link.
- Open the email to verify its contents and make sure the link works as expected.

### **Using Mailtrap and Postman with Registration, Magic Link Verification, and Login**

### **1. Set Up Mailtrap**

Check the first guide: [Set Up and Use Mailtrap](#set-up-and-use-mailtrap).

### **2. Prepare Postman for Requests**

**A. Open Postman:**

1. Launch the Postman application on your computer.

**B. Create a New Collection:**

1. Click on **Collections** in the left sidebar.
2. Click on **New Collection** and give it a name, such as `Tribe API`.

**C. Add Requests to the Collection:**
For each request, follow these steps:

---

### **2.1. Registration Request**

**A. Create Request:**

1. Click on **New** and select **HTTP Request**.
2. Name it `Registration`.

**B. Configure Request:**

1. Set the method to **POST**.
2. Enter the URL: `http://localhost:8080/auths/registrations`.
3. In the **Body** tab, select **raw** and **JSON** (you should see `JSON` in the top right corner).
4. Enter the following JSON in the body:

    ```json
    {
      "nickName": "JohnDoe123",
      "email": "johndoe@gmail.com",
      "password": "1234"
    }
    ```

**C. Send Request:**  Click the **Send** button.

**D. Check in Mailtrap:**

1. Go to your inbox in Mailtrap.
2. You should see an email with the magic link to verify the registration.

---

### **2.2. Verify Magic Link for Registration**

1. Open the email in Mailtrap.
2. Copy the token from the magic link (you can find it in the URL).

**B. Create Request:** In Postman, create a new request and name it `Verify Magic Link`.

**C. Configure Request:**

1. Set the method to **POST**.
2. Enter the URL: `http://localhost:8080/auths/registrations/tokens`.
3. In the **Body** tab, select **raw** and **JSON**.
4. Enter the following JSON in the body, replacing `your_magic_link_token` with the token you copied:

    ```json
    {
      "token": "your_magic_link_token"
    }
    ```

**D. Send Request:** Click the **Send** button.

**E. Verify the Response:** You should receive a response indicating that the magic link has been successfully verified.

---

### **2.3. Login Request**

**A. Create Request:** In Postman, create a new request and name it `Login`.

**B. Configure Request:**

1. Set the method to **POST**.
2. Enter the URL: `http://localhost:8080/auths/sessions`.
3. In the **Body** tab, select **raw** and **JSON**.
4. Enter the following JSON in the body:

    ```json
    {
      "email": "johndoe@gmail.com",
      "password": "1234"
    }
    ```

**C. Send Request:** Click the **Send** button.

**D. Verify the Response:** You should receive a session token or a success message indicating that you have logged in successfully.

---

### **Using Mailtrap and Postman with Password Reset, Magic Link Verification, and Password Change**

### **1. Set Up Mailtrap**

Check the first guide: [Set Up and Use Mailtrap](#set-up-and-use-mailtrap).

### **2. Prepare Postman for Requests**

**A. Open Postman:** Launch the Postman application on your computer.

**B. Create a New Collection:**

1. If you don’t have a collection, click on **Collections** in the left sidebar.
2. Click on **New Collection** and give it a name, such as `Tribe API`.

**C. Add Requests to the Collection:**
For each request, follow these steps:

---

### **2.1. Password Reset Request**

**A. Create Request:** Click on **New** and select **HTTP Request**.

**B. Configure Request:**

1. Set the method to **POST**.
2. Enter the URL: `http://localhost:8080/auths/sessions/passwords`.
3. In the **Body** tab, select **raw** and **JSON** (you should see `JSON` in the top right corner).
4. Enter the following JSON in the body:

    ```json
    {
      "email": "johndoe@gmail.com"
    }
    ```

**C. Send Request:** Click the **Send** button.

**D. Check in Mailtrap:**

1. Go to your inbox in Mailtrap.
2. You should see an email with the magic link to reset the password.

---

### **2.2. Verify Magic Link**

**A. Obtain the Token:**

1. Open the email in Mailtrap.
2. Copy the token from the magic link (you can find it in the URL).

**B. Create Request:** In Postman, create a new request and name it `Verify Magic Link`.

**C. Configure Request:**

1. Set the method to **POST**.
2. Enter the URL: `http://localhost:8080/auths/sessions/passwords/tokens`.
3. In the **Body** tab, select **raw** and **JSON**.
4. Enter the following JSON in the body, replacing `your_magic_link_token` with the token you copied:

    ```json
    {
      "token": "your_magic_link_token"
    }
    ```

**D. Send Request:** Click the **Send** button.

**E. Verify the Response:** You should receive a response indicating that the magic link has been successfully verified.

---

### **2.3. Change Password**

**A. Create Request:** In Postman, create a new request and name it `Change Password`.

**B. Configure Request:**

1. Set the method to **PATCH**.
2. Enter the URL: `http://localhost:8080/auths/sessions/passwords`.
3. In the **Body** tab, select **raw** and **JSON**.
4. Enter the following JSON in the body, replacing `token_from_verify_magic_link_request_response` with the token you received in the magic link verification response:

    ```json
    {
      "token": "token_from_verify_magic_link_request_response",
      "newPassword": "123456"
    }
    ```

**C. Send Request:** Click the **Send** button.

**D. Verify the Response:** You should receive a response indicating that the password has been successfully changed.

---

### **Setting Environment Variables in Postman**

### **1. Create a New Environment in Postman**

1. **Open Postman**: Launch the Postman application on your computer.
2. **Navigate to Environments**: Click on the gear icon ⚙️ in the top right corner, then select **Manage Environments**.
3. **Add New Environment**: Click on **Add** to create a new environment.
4. **Name the Environment**: Give your environment a meaningful name (e.g., `Tribe Development`).

### **2. Set Up `authToken` Variable**

1. **Select Your Environment**: In the top right corner, select the environment you just created from the dropdown menu.
2. **Create Variable**: Under **VARIABLES**, add a new variable:
    - **Key**: `authToken`
    - **Initial Value**: Leave this empty for now.
    - **Current Value**: Leave this empty for now.
3. **Save Changes**: Click the **Save** button.
### **3. Store `authToken` After Login**
1. **Create Login Request**: In Postman, create a request for your login endpoint.
    - **Method**: `POST`
    - **URL**: `http://localhost:8080/auths/sessions`
    - **Body**:

        ```json
        {
          "email": "johndoe@gmail.com",
          "password": "1234"
        }
        ```

2. **Send the Request**: Click the **Send** button.
3. **Capture the Token**: Once you receive the response, you need to extract the `authToken` from the response body. For example:

    ```json
    {
        "authToken": "your_generated_token"
    }
    ```

4. **Set the Token in Environment Variable**:
    - Go to the Scripts tab of your login request.
    - In the Post-response section add the following code to automatically set the `authToken` in the environment variable:

        ```jsx
        let response = pm.response.json();
        
        // Log the full response to the Postman console to check the structure (optional for debugging)
        console.log(response);
        
        // Capture the token and store it in the environment variable
        let token = response.token;
        
        if (token) {
        	pm.environment.set("authToken", token);
        } else {
        	console.log("Token not found in the response");
        }
        ```

5. **Save the Request**: Click the **Save** button.

### **4. Use `authToken` in Other Requests**

**Authorization Header**: For any requests that require authentication, you can set the Authorization header as follows:
- Go to the Authorization tab in your request.
- Select Bearer Token from the Type dropdown.
- In the Token field, use the variable syntax: {{authToken}}.

### **5. Create `NODE_ENV` Variable**

1. Add `NODE_ENV` Variable: In the same environment you created, add another variable:
- Key: `NODE_ENV`
- Initial Value: `development`
- Current Value: `development`
2. Save Changes: Click the Save button.

### **6. Use `NODE_ENV` in Your Code**

The `NODE_ENV` variable will be utilized in your `authController.js` methods. Here's how it affects the logic:
- In the `verifyMagicLink` method, if `NODE_ENV` is set to `'development'`, a JSON response will be returned for Postman testing. This is useful for verifying the magic link without redirecting to a frontend.
- Similarly, in the `verifyPasswordResetMagicLink` method, the same condition checks if you are in development mode or if there is no frontend URL set, allowing you to receive a JSON response instead of a redirect.

