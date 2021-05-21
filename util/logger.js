/**
 * module import
 */
const dotenv = require("dotenv");
const chalk = require("chalk");
const loggerFactory = require("console-log-level");

dotenv.config();

const LOGGING_LEVEL = {
  INFO: "info",
  DEBUG: "debug",
  ERROR: "error",
};

/**
 * 로거 설정  
 */
const log = loggerFactory({
  prefix: (level) => {
    const LOG_PREFIX = `${new Date().toISOString()} [${level}]`;
    switch (level) {
      case LOGGING_LEVEL.INFO:
        return chalk.green(LOG_PREFIX);
      case LOGGING_LEVEL.DEBUG:
        return chalk.yellow(LOG_PREFIX);
      case LOGGING_LEVEL.ERROR:
        return chalk.red(LOG_PREFIX);
      default:
        return chalk.white(LOG_PREFIX);
    }
  },
  level: process.env.LOGGING_LEVEL,
});

module.exports = log;
