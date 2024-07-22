import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: { default: 'nx run kids-guitar-dojo:start' },
      ciWebServerCommand: 'nx run kids-guitar-dojo:serve-static',
    }),
    baseUrl: 'http://localhost:3000',
  },
});
