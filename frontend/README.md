This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Architecture layers

### UI

- React
- Receive state as props or hooks
- Receive actions as props or hooks

### Store

- MobX
- Holds the state
- Define actions that call the interactor
- Just stores the state, does not mudate it

### Interactor

- Define the business rules
- Receive a state and ruturn the new state
- Perform validations
- Knows when to call the client and to handle the response

### Client

- API integration
