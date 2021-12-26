# objective

Main objective is to develop a node.js service that handles below operations:

- Create User: Make a JSON request to create a new user. Make sure the password is hashed before storing in the databse. The user's age sent with YYYY-MM-DD format from the client and should be stored as decimal. Store ID field as unique.
- Fetch User: Make a request with two fields in the body: ID and password. Compare the password with the stored password in the db, if It's the same pass the user as response. Password field displays as \*\*\*\*.
- Create Product: Make a request to an endpoint to see the product details. Remember store the ID as unique and store the current date and time into Date field.
- Fetch one product: Make a request to an endpoint to get the product info.
- Fetch Products: Make a request include filters on the price field. If the request doesn't include any filters, fetch all products by default.
- Purchase Product: First, check that the order count is not grater than the product stock then decrement the stock and push the ID to the Purchased_products of the user then return thankYou message with the total price, otherwise return error message to the user.

This application is completely based on the [`tenzumusic-product-purchase-service-expressjs`](https://github.com/professordev7/tenzumusic-product-purchase-service-expressjs) application

The application re-developed using the amazing [`Prisma`](https://www.prisma.io/) ORM and added some other features like error handling middlewares.

## Details

- First, install the dependencies using `npm install`
- Second, compile your typescript files using `tsc` in the separated cli or use the `ts-node` tool
- The service should be started with `npm run start` and listen on port 5000
