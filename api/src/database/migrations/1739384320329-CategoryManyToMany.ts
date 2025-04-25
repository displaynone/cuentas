import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoryManyToMany1739384320329 implements MigrationInterface {
  name = 'CategoryManyToMany1739384320329';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_d3951864751c5812e70d033978d\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`transaction_categories_category\` (\`transactionId\` varchar(36) NOT NULL, \`categoryId\` varchar(36) NOT NULL, INDEX \`IDX_f122af6428c36e90cc79141e52\` (\`transactionId\`), INDEX \`IDX_3d308518c7d704c7ed5dd6c153\` (\`categoryId\`), PRIMARY KEY (\`transactionId\`, \`categoryId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` DROP COLUMN \`categoryId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` ADD CONSTRAINT \`FK_f122af6428c36e90cc79141e523\` FOREIGN KEY (\`transactionId\`) REFERENCES \`transaction\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` ADD CONSTRAINT \`FK_3d308518c7d704c7ed5dd6c1538\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` DROP FOREIGN KEY \`FK_3d308518c7d704c7ed5dd6c1538\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` DROP FOREIGN KEY \`FK_f122af6428c36e90cc79141e523\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD \`categoryId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_3d308518c7d704c7ed5dd6c153\` ON \`transaction_categories_category\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_f122af6428c36e90cc79141e52\` ON \`transaction_categories_category\``,
    );
    await queryRunner.query(`DROP TABLE \`transaction_categories_category\``);
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_d3951864751c5812e70d033978d\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
