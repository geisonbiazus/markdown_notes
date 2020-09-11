const defaultConfig = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'markdown_notes',
  synchronize: false,
  logging: true,
  entities: ['src/notes/repositories/typeORM/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migrations',
  },
};

const envConfig =
  process.env.NODE_ENV === 'test'
    ? {
        host: 'localhost',
        port: 5433,
        username: 'postgres',
        password: 'postgres',
        database: 'markdown_notes_test',
        logging: false,
      }
    : {};

module.exports = { ...defaultConfig, ...envConfig };
