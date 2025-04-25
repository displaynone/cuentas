import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoryIdAsNumber1739567909449 implements MigrationInterface {
  name = 'CategoryIdAsNumber1739567909449';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` DROP FOREIGN KEY \`FK_3d308518c7d704c7ed5dd6c1538\``,
    );
    await queryRunner.query(`ALTER TABLE \`category\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` ADD PRIMARY KEY (\`transactionId\`)`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_3d308518c7d704c7ed5dd6c153\` ON \`transaction_categories_category\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` DROP COLUMN \`categoryId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` ADD \`categoryId\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` ADD PRIMARY KEY (\`transactionId\`, \`categoryId\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_3d308518c7d704c7ed5dd6c153\` ON \`transaction_categories_category\` (\`categoryId\`)`,
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
      `DROP INDEX \`IDX_3d308518c7d704c7ed5dd6c153\` ON \`transaction_categories_category\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` ADD PRIMARY KEY (\`transactionId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` DROP COLUMN \`categoryId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` ADD \`categoryId\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_3d308518c7d704c7ed5dd6c153\` ON \`transaction_categories_category\` (\`categoryId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` ADD PRIMARY KEY (\`categoryId\`, \`transactionId\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`category\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD \`id\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`category\` ADD PRIMARY KEY (\`id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` ADD CONSTRAINT \`FK_3d308518c7d704c7ed5dd6c1538\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
