const defaultConfig = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5434,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'markdown_notes',
  synchronize: false,
  logging: true,
  entities: ['src/**/typeORM/entities/**/*'],
  migrations: ['src/shared/migrations/**/*'],
  cli: {
    migrationsDir: 'src/shared/migrations',
  },
};

const envConfig =
  (process.env.NODE_ENV === 'test' && {
    host: process.env.DB_TEST_HOST || 'localhost',
    port: process.env.DB_TEST_PORT || 5435,
    username: process.env.DB_TEST_USERNAME || 'postgres',
    password: process.env.DB_TEST_PASSWORD || 'postgres',
    database: process.env.DB_TEST_NAME || 'markdown_notes_test',
    logging: false,
  }) ||
  (process.env.NODE_ENV === 'production' && {
    entities: ['build/**/typeORM/entities/**/*'],
    migrations: ['build/shared/migrations/**/*'],
  }) ||
  {};

module.exports = { ...defaultConfig, ...envConfig };
