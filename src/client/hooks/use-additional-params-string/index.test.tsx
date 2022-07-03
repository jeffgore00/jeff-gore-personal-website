/**
 * @jest-environment jsdom
 */

import { useLocation } from 'react-router-dom';
import { useAdditionalParamsString } from '.';

// Can't use spyOn for this library for some reason. Get "TypeError: Cannot redefine property: useLocation"
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

describe('useAdditionalParamsString', () => {
  const useLocationMock = useLocation as jest.Mock;

  describe('When a query string exists', () => {
    beforeAll(() => {
      useLocationMock.mockImplementation(() => ({
        search: '?useDummyPreviews=true&jeff=cool',
      }));
    });
    it('Replaces the initial "?" with "&" and then returns that string', () => {
      const val = useAdditionalParamsString();
      expect(val).toEqual('&useDummyPreviews=true&jeff=cool');
    });
  });

  describe('When a query string does not exist', () => {
    beforeAll(() => {
      useLocationMock.mockImplementation(() => ({
        search: '',
      }));
    });
    it('Retuns an empty string', () => {
      const val = useAdditionalParamsString();
      expect(val).toEqual('');
    });
  });
});
