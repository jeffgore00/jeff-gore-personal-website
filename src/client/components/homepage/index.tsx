import React, { useEffect } from 'react';

import logger from '../../utils/logger';

export const HOMEPAGE_RENDERED_LOG = 'Homepage Rendered';

export const Homepage = (): React.ReactElement => {
  useEffect(() => {
    void logger.info(HOMEPAGE_RENDERED_LOG);
  }, []);

  return (
    <div id="homepage-content" data-testid="homepage-content">
      <p>
        My website is under construction. Until it&apos;s ready, enjoy these
        quotes on journalism from one of my favorite writers,{' '}
        <a href="https://en.wikipedia.org/wiki/Janet_Malcolm">Janet Malcolm</a>.
      </p>
      <aside style={{ marginLeft: '2em' }}>
        <p>
          “Every journalist who is not too stupid or full of himself to notice
          what is going on knows that what he does is morally indefensible. He
          is a kind of confidence man, preying on people&apos;s vanity,
          ignorance, or loneliness, gaining their trust and betraying them
          without remorse.”
        </p>
        <p>
          “Something seems to happen to people when they meet a journalist, and
          what happens is exactly the opposite of what one would expect. One
          would think that extreme wariness and caution would be the order of
          the day, but in fact childish trust and impetuosity are far more
          common. The journalistic encounter seems to have the same regressive
          effect on a subject as the psychoanalytic encounter. The subject
          becomes a kind of child of the writer, regarding him as a permissive,
          all-accepting, all-forgiving mother, and expecting that the book will
          be written by her. Of course, the book is written by the strict,
          all-noticing, unforgiving father.”
        </p>
      </aside>
    </div>
  );
};
