import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostProcessingNumberId1739900768576 implements MigrationInterface {
  name = 'PostProcessingNumberId1739900768576';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` DROP FOREIGN KEY \`FK_8518c7d704c7ed5dd6c1538\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_8e89cf8ff9b69b4eed295a\` ON \`transaction\``,
    );
    await queryRunner.query(`ALTER TABLE \`post_processing\` DROP PRIMARY KEY`);
    await queryRunner.query(
      `ALTER TABLE \`post_processing\` DROP COLUMN \`id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`post_processing\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_63e98e89cf8ff9b69b4eed295a\` ON \`transaction\` (\`reference\`, \`date\`, \`amount\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_63e98e89cf8ff9b69b4eed295a\` ON \`transaction\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`post_processing\` DROP COLUMN \`id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`post_processing\` ADD \`id\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`post_processing\` ADD PRIMARY KEY (\`id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_8e89cf8ff9b69b4eed295a\` ON \`transaction\` (\`reference\`, \`date\`, \`amount\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` ADD CONSTRAINT \`FK_8518c7d704c7ed5dd6c1538\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
