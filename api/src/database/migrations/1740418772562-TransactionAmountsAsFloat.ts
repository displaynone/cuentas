import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionAmountsAsFloat1740418772562
  implements MigrationInterface
{
  name = 'TransactionAmountsAsFloat1740418772562';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_63e98e89cf8ff9b69b4eed295a\` ON \`transaction\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` DROP COLUMN \`balance\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD \`balance\` float NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` DROP COLUMN \`amount\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD \`amount\` float NOT NULL`,
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
      `ALTER TABLE \`transaction\` DROP COLUMN \`amount\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD \`amount\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` DROP COLUMN \`balance\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD \`balance\` int NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_63e98e89cf8ff9b69b4eed295a\` ON \`transaction\` (\`reference\`, \`date\`, \`amount\`)`,
    );
  }
}
