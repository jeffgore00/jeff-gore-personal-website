import * as developmentConfig from './development.json';
import * as testConfig from './test.json';
import * as productionConfig from './production.json';

type Config = {
  backendUrl: string;
  frontendUrl: string;
  corsWhitelist: string[];
};

const configMap: { [key: string]: Config } = {
  development: developmentConfig,
  test: testConfig,
  production: productionConfig,
};

export function getConfig(environment?: string): Config {
  const env = environment || process.env.NODE_ENV || 'production';

  return configMap[env] || productionConfig;
}
