import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addNameToUsers1610954129203 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({ name: 'name', type: 'varchar', isNullable: true })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'name');
  }
}
