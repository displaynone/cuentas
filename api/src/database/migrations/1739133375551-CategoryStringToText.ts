import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoryStringToText1739133375551 implements MigrationInterface {
  name = 'CategoryStringToText1739133375551';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`category\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD \`description\` text NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`match\``);
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD \`match\` text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`match\``);
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD \`match\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD \`description\` varchar(255) NULL`,
    );
  }
}
