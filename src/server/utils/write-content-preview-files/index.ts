import { buildContentPreviews } from '../build-content-previews';

void buildContentPreviews({ writeFiles: true }).then(() => {
  // eslint-disable-next-line no-console
  console.log('Successfully built content previews');
});
