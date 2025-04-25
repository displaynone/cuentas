import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDateIndexToTransaction1739296998755
  implements MigrationInterface
{
  name = 'AddDateIndexToTransaction1739296998755';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX \`IDX_f74e18cc3832e2b39ea077a6c8\` ON \`transaction\` (\`date\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_f74e18cc3832e2b39ea077a6c8\` ON \`transaction\``,
    );
  }
}
