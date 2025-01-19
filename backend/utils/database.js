const { Pool } = require("pg");

class Database {
  pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.PGSQL_HOST,
      port: process.env.PGSQL_PORT
        ? parseInt(process.env.PGSQL_PORT)
        : undefined,
      user: process.env.PGSQL_USERNAME,
      password: process.env.PGSQL_PASSWORD,
      database: process.env.PGSQL_DATABASE,
    });
  }

  async query(queryString, params = []) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(queryString, params);

      return result.rows;
    } catch (error) {
      console.error("Database query error: ", error);
      throw error;
    } finally {
      client.release();
    }
  }

  async insert(table, data, returning = ["*"]) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) {
      throw new Error("Invalid table name");
    }

    const keys = Object.keys(data);
    if (keys.length === 0) {
      throw new Error("No data provided for insertion");
    }

    const columns = [];
    const params = [];
    const placeholders = [];

    keys.forEach((key, index) => {
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
        throw new Error(`Invalid column name: ${key}`);
      }

      columns.push(key);
      params.push(data[key]);
      placeholders.push(`$${index + 1}`);
    });

    const validReturningColumns = returning.map((col) => {
      if (col !== "*" && !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(col)) {
        throw new Error(`Invalid returning column: ${col}`);
      }
      return col;
    });

    // Construct the insert query
    const queryString = `
      INSERT INTO ${table} (${columns.join(", ")}) 
      VALUES (${placeholders.join(", ")}) 
      RETURNING ${validReturningColumns.join(", ")}
    `.trim();

    // Execute insert and return inserted rows
    return this.query(queryString, params);
  }

  async select(table, where = [], order = null) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) {
      throw new Error("Invalid table name");
    }

    let whereClause = "";
    const params = [];

    if (where.length > 0) {
      const conditions = where.map((condition, index) => {
        // Validate column name
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(condition.column)) {
          throw new Error(`Invalid column name: ${condition.column}`);
        }

        // Validate operator
        const validOperators = ["=", "!=", ">", "<", ">=", "<=", "LIKE", "IN"];
        if (!validOperators.includes(condition.operator.toUpperCase())) {
          throw new Error(`Invalid operator: ${condition.operator}`);
        }

        // Validate next (logical operator)
        const validNextOperators = ["AND", "OR", null];
        if (
          condition.next &&
          !validNextOperators.includes(condition.next.toUpperCase())
        ) {
          throw new Error(`Invalid logical operator: ${condition.next}`);
        }

        // Add parameter and build condition
        params.push(condition.value);
        return `${condition.column} ${condition.operator} $${params.length}${
          condition.next ? ` ${condition.next}` : ""
        }`;
      });

      whereClause = "WHERE " + conditions.join(" ");
    }

    let orderClause = "";
    if (order !== null) {
      // Validate order column and direction
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(order.column)) {
        throw new Error(`Invalid order column: ${order.column}`);
      }

      const validDirections = ["ASC", "DESC"];
      if (!validDirections.includes(order.direction.toUpperCase())) {
        throw new Error(`Invalid order direction: ${order.direction}`);
      }

      orderClause = `ORDER BY ${order.column} ${order.direction.toUpperCase()}`;
    }

    const queryString =
      `SELECT * FROM ${table} ${whereClause} ${orderClause}`.trim();

    return this.query(queryString, params);
  }

  async selectPaginate(
    table,
    page = 1,
    rowsPerPage = 10,
    where = [],
    order = null
  ) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) {
      throw new Error("Invalid table name");
    }

    let whereClause = "";
    const params = [];

    if (where.length > 0) {
      const conditions = where.map((condition, index) => {
        // Validate column name
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(condition.column)) {
          throw new Error(`Invalid column name: ${condition.column}`);
        }

        // Validate operator
        const validOperators = ["=", "!=", ">", "<", ">=", "<=", "LIKE", "IN"];
        if (!validOperators.includes(condition.operator.toUpperCase())) {
          throw new Error(`Invalid operator: ${condition.operator}`);
        }

        // Validate next (logical operator)
        const validNextOperators = ["AND", "OR", null];
        if (
          condition.next &&
          !validNextOperators.includes(condition.next.toUpperCase())
        ) {
          throw new Error(`Invalid logical operator: ${condition.next}`);
        }

        // Add parameter and build condition
        params.push(condition.value);
        return `${condition.column} ${condition.operator} $${params.length}${
          condition.next ? ` ${condition.next}` : ""
        }`;
      });

      whereClause = "WHERE " + conditions.join(" ");
    }

    let orderClause = "";
    if (order !== null) {
      // Validate order column and direction
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(order.column)) {
        throw new Error(`Invalid order column: ${order.column}`);
      }

      const validDirections = ["ASC", "DESC"];
      if (!validDirections.includes(order.direction.toUpperCase())) {
        throw new Error(`Invalid order direction: ${order.direction}`);
      }

      orderClause = `ORDER BY ${order.column} ${order.direction.toUpperCase()}`;
    }

    const offset = (page - 1) * rowsPerPage;

    const queryString =
      `SELECT * FROM ${table} ${whereClause} ${orderClause} LIMIT ${rowsPerPage} OFFSET ${offset}`.trim();

    return this.query(queryString, params);
  }

  async update(table, updates, where = []) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) {
      throw new Error("Invalid table name");
    }

    const updateKeys = Object.keys(updates);
    if (updateKeys.length === 0) {
      throw new Error("No update values provided");
    }

    const updateParams = [];
    const updateClauses = updateKeys.map((key) => {
      // Validate column name
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
        throw new Error(`Invalid column name: ${key}`);
      }

      updateParams.push(updates[key]);
      return `${key} = $${updateParams.length}`;
    });

    const setClause = "SET " + updateClauses.join(", ");

    // Prepare WHERE clause
    let whereClause = "";
    const whereParams = [];

    if (where.length > 0) {
      const conditions = where.map((condition) => {
        // Validate column name
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(condition.column)) {
          throw new Error(`Invalid column name: ${condition.column}`);
        }

        // Validate operator
        const validOperators = ["=", "!=", ">", "<", ">=", "<=", "LIKE", "IN"];
        if (!validOperators.includes(condition.operator.toUpperCase())) {
          throw new Error(`Invalid operator: ${condition.operator}`);
        }

        // Validate next (logical operator)
        const validNextOperators = ["AND", "OR", null];
        if (
          condition.next &&
          !validNextOperators.includes(condition.next.toUpperCase())
        ) {
          throw new Error(`Invalid logical operator: ${condition.next}`);
        }

        // Add parameter and build condition
        whereParams.push(condition.value);
        return `${condition.column} ${condition.operator} $${
          updateParams.length + whereParams.length
        }${condition.next ? ` ${condition.next}` : ""}`;
      });

      whereClause = "WHERE " + conditions.join(" ");

      const queryString =
        `UPDATE ${table} ${setClause} ${whereClause} RETURNING *`.trim();

      const params = [...updateParams, ...whereParams];

      return this.query(queryString, params);
    }
  }

  async delete(table, where = [], returning = ["*"]) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) {
      throw new Error("Invalid table name");
    }

    // Prepare WHERE clause
    let whereClause = "";
    const params = [];

    if (where.length > 0) {
      const conditions = where.map((condition) => {
        // Validate column name
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(condition.column)) {
          throw new Error(`Invalid column name: ${condition.column}`);
        }

        // Validate operator
        const validOperators = ["=", "!=", ">", "<", ">=", "<=", "LIKE", "IN"];
        if (!validOperators.includes(condition.operator.toUpperCase())) {
          throw new Error(`Invalid operator: ${condition.operator}`);
        }

        // Validate next (logical operator)
        const validNextOperators = ["AND", "OR", null];
        if (
          condition.next &&
          !validNextOperators.includes(condition.next.toUpperCase())
        ) {
          throw new Error(`Invalid logical operator: ${condition.next}`);
        }

        // Add parameter and build condition
        params.push(condition.value);
        return `${condition.column} ${condition.operator} $${params.length}${
          condition.next ? ` ${condition.next}` : ""
        }`;
      });

      whereClause = "WHERE " + conditions.join(" ");
    }

    // Validate returning columns
    const validReturningColumns = returning.map((col) => {
      if (col !== "*" && !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(col)) {
        throw new Error(`Invalid returning column: ${col}`);
      }
      return col;
    });

    // Construct delete query
    const queryString = `
      DELETE FROM ${table} 
      ${whereClause} 
      RETURNING ${validReturningColumns.join(", ")}
    `.trim();

    // Execute delete and return deleted rows
    return this.query(queryString, params);
  }
}

const db = new Database();

module.exports = { db };
