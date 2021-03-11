import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class addUserIdToNote1609312997526 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'notes',
      new TableColumn({ name: 'user_id', type: 'uuid', isNullable: true })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('notes', 'user_id');
  }
}
