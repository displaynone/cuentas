import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionIndexToBalance1740506281873
  implements MigrationInterface
{
  name = 'TransactionIndexToBalance1740506281873';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_63e98e89cf8ff9b69b4eed295a\` ON \`transaction\``,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_830f179456245e2f13876225a3\` ON \`transaction\` (\`reference\`, \`date\`, \`balance\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_830f179456245e2f13876225a3\` ON \`transaction\``,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_63e98e89cf8ff9b69b4eed295a\` ON \`transaction\` (\`reference\`, \`date\`, \`amount\`)`,
    );
  }
}
