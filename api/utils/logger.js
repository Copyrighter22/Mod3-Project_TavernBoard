// -----------------------------------------------------------------------------
// @desc    Instancia y configuración del Logger centralizado con Pino
// -----------------------------------------------------------------------------
const pino = require("pino");
const config = require("../config/config");

const isDevelopment = config.get("env") === "development";

// Creamos la configuración base limpia sin transportes por defecto
const loggerOptions = {
  level: isDevelopment ? "debug" : "info",
};

// Solo inyectamos la propiedad 'transport' si estamos estrictamente en desarrollo
if (isDevelopment) {
  loggerOptions.transport = {
    target: "pino-pretty",
    options: { colorize: true, translateTime: "SYS:standard" },
  };
}

const logger = pino(loggerOptions);

module.exports = logger;
