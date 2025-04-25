import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategory1735921698759 implements MigrationInterface {
  name = 'CreateCategory1735921698759';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`description\` varchar(255) NULL, \`name\` varchar(255) NOT NULL, \`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD \`categoryId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_d3951864751c5812e70d033978d\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_d3951864751c5812e70d033978d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` DROP COLUMN \`categoryId\``,
    );
    await queryRunner.query(`DROP TABLE \`category\``);
  }
}
