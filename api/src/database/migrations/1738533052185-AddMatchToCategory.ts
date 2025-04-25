import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMatchToCategory1738533052185 implements MigrationInterface {
  name = 'AddMatchToCategory1738533052185';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD \`match\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`match\``);
  }
}
