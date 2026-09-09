// -----------------------------------------------------------------------------
// @desc    Instancia y configuración del Logger centralizado con Pino
// -----------------------------------------------------------------------------
const pino = require("pino");
const config = require("../config/config");

const isDevelopment = config.get("env") === "development";

// Solo configuramos el transport si estamos 100% seguros de que es desarrollo
const loggerOptions = {
  level: isDevelopment ? "debug" : "info",
};

if (isDevelopment) {
  loggerOptions.transport = {
    target: "pino-pretty",
    options: { colorize: true, translateTime: "SYS:standard" },
  };
}

const logger = pino(loggerOptions);

module.exports = logger;
