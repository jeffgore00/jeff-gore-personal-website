import Media from 'react-media';

enum MediaProfile {
  Desktop = 'desktop',
  Mobile = 'mobile',
}

interface ScreenWidthSimulators {
  simulateMobileScreenWidth: () => void;
  simulateDesktopScreenWidth: () => void;
}

type MediaProps = { children: (matchesQuery: boolean) => React.ReactElement };
type MediaWrapper = (props: MediaProps) => React.ReactElement;

function createMediaWrapper(mediaProfile: MediaProfile): MediaWrapper {
  let matchesDesktopQuery: boolean;

  switch (mediaProfile) {
    case MediaProfile.Desktop:
      matchesDesktopQuery = true;
      break;
    case MediaProfile.Mobile:
    default:
      matchesDesktopQuery = false;
  }

  return function MediaWrapper(props: MediaProps): React.ReactElement {
    return props.children(matchesDesktopQuery);
  };
}

/* This requires react-media to have been mocked with a Jest function, i.e.
jest.mock('react-media', () => jest.fn()). It defaults the mock to a mobile
screen width - "mobile first" philosophy. */
export function setupReactMediaMock(): ScreenWidthSimulators {
  const MediaMock = Media as jest.Mock;
  MediaMock.mockImplementation(createMediaWrapper(MediaProfile.Mobile));

  function simulateMobileScreenWidth(): void {
    MediaMock.mockImplementation(createMediaWrapper(MediaProfile.Mobile));
  }
  function simulateDesktopScreenWidth(): void {
    MediaMock.mockImplementation(createMediaWrapper(MediaProfile.Desktop));
  }

  return { simulateMobileScreenWidth, simulateDesktopScreenWidth };
}
