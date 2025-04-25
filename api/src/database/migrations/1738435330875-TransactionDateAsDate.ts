import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionDateAsDate1738435330875 implements MigrationInterface {
  name = 'TransactionDateAsDate1738435330875';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`date\``);
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD \`date\` datetime NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`date\``);
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD \`date\` int NOT NULL`,
    );
  }
}
