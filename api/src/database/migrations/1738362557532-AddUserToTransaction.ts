import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserToTransaction1738362557532 implements MigrationInterface {
  name = 'AddUserToTransaction1738362557532';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD \`userId\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` ADD CONSTRAINT \`FK_605baeb040ff0fae995404cea37\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`transaction\` DROP FOREIGN KEY \`FK_605baeb040ff0fae995404cea37\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`transaction\` DROP COLUMN \`userId\``,
    );
  }
}
