import { useLocation } from 'react-router-dom';

export function useAdditionalParamsString(): string {
  const queryString = useLocation().search;
  const additionalParamsString = queryString
    ? `&${queryString.replace('?', '')}`
    : '';
  return additionalParamsString;
}
