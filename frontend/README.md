This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Architecture layers

### UI

- React
- Receive state as props or hooks
- Receive store as props or hooks

### Stores

- Holds the state
- Define the business rules
- Perform validations
- Knows when to call the client and to handle the response

### Client

- API integration
