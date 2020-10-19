## Configuring local enviroment

Install dependencies:

```
npm install
```

Start databases:

```
docker-compose up -d
```

Run migrations:

```
npm db:migrate
npm db:migrate:test
```

Run tests:

```
npm test
```

Start application:

```
npm start
```

## Troubleshooting

When Jest tries to run tet files that do no exist anymore delete the jest cache files.
Find them with the command:

```
npx jest --showConfig | grep cache
```
