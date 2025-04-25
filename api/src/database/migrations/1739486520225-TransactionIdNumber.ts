import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionIdNumber1739486520225 implements MigrationInterface {
  name = 'TransactionIdNumber1739486520225';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` DROP FOREIGN KEY \`FK_f122af6428c36e90cc79141e523\``,
    );
    await queryRunner.query(`ALTER TABLE \`transaction\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` ADD PRIMARY KEY (\`categoryId\`)`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_f122af6428c36e90cc79141e52\` ON \`transaction_categories_category\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` DROP COLUMN \`transactionId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` ADD \`transactionId\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` ADD PRIMARY KEY (\`categoryId\`, \`transactionId\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_f122af6428c36e90cc79141e52\` ON \`transaction_categories_category\` (\`transactionId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` ADD CONSTRAINT \`FK_f122af6428c36e90cc79141e523\` FOREIGN KEY (\`transactionId\`) REFERENCES \`transaction\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` DROP FOREIGN KEY \`FK_f122af6428c36e90cc79141e523\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_f122af6428c36e90cc79141e52\` ON \`transaction_categories_category\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` ADD PRIMARY KEY (\`categoryId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` DROP COLUMN \`transactionId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` ADD \`transactionId\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_f122af6428c36e90cc79141e52\` ON \`transaction_categories_category\` (\`transactionId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` ADD PRIMARY KEY (\`transactionId\`, \`categoryId\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`transaction\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD \`id\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD PRIMARY KEY (\`id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction_categories_category\` ADD CONSTRAINT \`FK_f122af6428c36e90cc79141e523\` FOREIGN KEY (\`transactionId\`) REFERENCES \`transaction\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
