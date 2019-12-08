const winston=require("winston");
const logger=winston.createLogger({
    level:debug,
    format:winston.logger.combine(winston.format.colorize(),winston.format.json(),winston.format.timestamp({format:"YYYY-MM-DD HH:mm:ss"})),
    transports:[new winston.transports.File({filename:"error.log",level:"error"}),new winston.transports.File({filename:"app.log"})]
});
module.exports=logger;