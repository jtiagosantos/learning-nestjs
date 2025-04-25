export interface Env {
  getAppPort(): number;
  getNodeEnv(): string;
  getDatabaseHost(): string;
  getDatabasePort(): number;
  getDatabaseUsername(): string;
  getDatabasePassword(): string;
  getDatabaseName(): string;
}
