import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostProcessing1739486295109 implements MigrationInterface {
  name = 'PostProcessing1739486295109';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`post_processing\` (\`id\` varchar(36) NOT NULL, \`currentTransactionId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_e54832548f5750f18f5744782b\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_e54832548f5750f18f5744782b\` ON \`post_processing\``,
    );
    await queryRunner.query(`DROP TABLE \`post_processing\``);
  }
}
