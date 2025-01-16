const { db } = require("./database");

class Logger {
  dbTable;

  constructor() {
    this.dbTable = "crm_activity_log";
  }

  async insert(type, userId, action, details = "") {
    await db.insert(this.dbTable, {
      user_id: userId,
      type: type,
      action: action,
      details: details,
    });
  }
}

const logger = new Logger();

module.exports = { logger };
