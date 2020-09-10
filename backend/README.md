## Configuring local enviroment

Install dependencies:

```
npm install
```

Start databases:

```
docker-compose up -d
```

run migrations:

```
npm db:migrate
npm db:migrate:test
```

run tests:

```
npm test
```

start application:

```
npm start
```
