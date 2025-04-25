import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTransaction1735859858336 implements MigrationInterface {
  name = 'CreateTransaction1735859858336';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`transaction\` (\`balance\` int NULL, \`amount\` int NOT NULL, \`reference\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`concept\` varchar(255) NOT NULL, \`date\` int NOT NULL, \`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`transaction\``);
  }
}
