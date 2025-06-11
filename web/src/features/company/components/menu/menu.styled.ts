import { IonMenu } from '@ionic/react';
import styled, { css } from 'styled-components';

export const IonMenuStyle = styled(IonMenu)`
  & ion-content {
    --background: var(--ion-item-background, var(--ion-background-color, #fff));
  }

  &.md ion-content {
    // --padding-start: 8px;
    // --padding-end: 8px;
    // --padding-top: 20px;
    // --padding-bottom: 20px;
  }

  &.md ion-list {
    padding: unset;
    padding-bottom: 20px;
  }

  &.md ion-note {
    margin-bottom: 30px;
  }

  &.md ion-list-header,
  &.md ion-note {
    padding-left: 10px;
  }

  &.md ion-item {
    --padding-start: 10px;
    --padding-end: 10px;
    border-radius: 4px;
  }

  &.md ion-item.selected {
  --background: rgba(79, 70, 229, 0.14);
  }

  &.md ion-item.selected ion-icon {
  color: rgb(79, 70, 229);
}

  &.md ion-item ion-icon {
    color: #616e7e;
  }

  &.md ion-item ion-label {
    font-weight: 500;
  }

  &.ios ion-content {
    --padding-bottom: 20px;
  }

  &.ios ion-list {
    padding: 20px 0 0 0;
  }

  &.ios ion-note {
    line-height: 24px;
    margin-bottom: 20px;
  }

  &.ios ion-item {
    --padding-start: 16px;
    --padding-end: 16px;
    --min-height: 50px;
  }

  &.ios ion-item ion-icon {
    font-size: 24px;
  }

  &.ios ion-item .selected ion-icon {
    color: var(--ion-color-primary);
  }

  &.ios ion-list#labels-list ion-list-header {
    margin-bottom: 8px;
  }

  &.ios ion-list-header,
  &.ios ion-note {
    padding-left: 16px;
    padding-right: 16px;
  }

  &.ios ion-note {
    margin-bottom: 8px;
  }

  ion-note {
    display: inline-block;
    font-size: 16px;
    color: var(--ion-color-medium-shade);
  }

  &.md ion-item.selected {
  color: rgb(79, 70, 229);
}

  & ion-item[sub-menu-item] {
    padding-left: 12px;
  }
`;

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
`;

export const SubMenuItemLine = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  border-left: 1px dashed white;
  border-bottom: 1px dashed white;
  height: 45%;
  width: 8px;
`;
