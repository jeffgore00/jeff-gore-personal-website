import { getConfig } from '../shared/config';

export const apiUrl = `${getConfig(appEnvironment).backendUrl}/api`;
