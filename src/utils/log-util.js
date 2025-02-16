
/* Checks if logging is enabled in LS */
export const isLoggingEnabled = () => localStorage.getItem('debug') === '1';

/* Logs Information to Console */
export const logInfo = (...args) => {
  if (!isLoggingEnabled()) return;
  // eslint-disable-next-line no-console
  console.log(...args);
};

/* Logs Debug Statements to Console */
export const logDebug = (...args) => {
  if (!isLoggingEnabled()) return;
  // eslint-disable-next-line no-console
  console.debug(...args);
};

/* Logs Error to Console */
export const logError = (...args) => {
  // eslint-disable-next-line no-console
  console.error(...args);
};

/* Logs Warning to Console */
export const logWarn = (...args) => {
  // eslint-disable-next-line no-console
  console.warn(...args);
};
