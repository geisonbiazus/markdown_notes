import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddHtmlToNotes1608801035060 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'notes',
      new TableColumn({ name: 'html', type: 'text', isNullable: true })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('notes', 'html');
  }
}
