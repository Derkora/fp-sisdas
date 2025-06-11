import styled from 'styled-components';

export const THead = styled.thead`
  background: var(--ion-item-background);
  color: var(--colors);

  border-bottom: 1px solid rgb(232, 230, 227);
  min-height: 48px;
  height: 48px;

  font-size: 16px;
  font-weight: 700;
  text-align: left;
`;

export const TR = styled.tr`
  background: var(--ion-item-background);
  color: var(--color);
  border-bottom: 1px solid rgb(232, 230, 227);
  min-height: 48px;
  height: 48px;

  font-family: var(--ion-font-family, inherit);
  font-size: 16px;
  font-weight: 400;
  text-align: left;
`;

export const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Button = styled.button`
  border: 1px solid;
  padding: 0.25rem;
  border-radius: 0.25rem;
`;

export const Page = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;
