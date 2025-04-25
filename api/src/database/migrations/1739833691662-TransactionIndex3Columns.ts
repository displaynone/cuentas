import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionIndex3Columns1739833691662
  implements MigrationInterface
{
  name = 'TransactionIndex3Columns1739833691662';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX \`IDX_8e89cf8ff9b69b4eed295a\` ON \`transaction\` (\`reference\`, \`date\`, \`amount\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` ADD CONSTRAINT \`FK_8518c7d704c7ed5dd6c1538\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` DROP FOREIGN KEY \`FK_8518c7d704c7ed5dd6c1538\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_8e89cf8ff9b69b4eed295a\` ON \`transaction\``,
    );
  }
}
