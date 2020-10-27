import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createUsers1603786145006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'email', type: 'varchar', isNullable: false },
          { name: 'password', type: 'varchar', isNullable: false },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable('users');
  }
}
