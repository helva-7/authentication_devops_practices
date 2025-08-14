const testDbConnection = require('./testdb');

describe('database connection',() => {
    let connection;


    beforeAll(async () => {
        connection = await testDbConnection();
    } );

    afterAll(async () => {
        if (connection) await connection.end();
    });

    it('should connect and run a simple query', async () => {
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    expect(rows[0].result).toBe(2);
  });
});