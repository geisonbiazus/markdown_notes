const defaultConfig = {
  type: 'postgres',
  url: process.env.DB_URL || 'postgres://postgres:postgres@localhost:5434/markdown_notes',
  ssl: process.env.DB_SSL === 'true',
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
    url: process.env.DB_TEST_URL || 'postgres://postgres:postgres@localhost:5435/markdown_notes_test',
    logging: false,
  }) ||
  (process.env.NODE_ENV === 'production' && {
    entities: ['build/**/typeORM/entities/**/*'],
    migrations: ['build/shared/migrations/**/*'],
  }) ||
  {};

module.exports = { ...defaultConfig, ...envConfig };
