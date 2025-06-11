import { RoleValues } from "@/lib/authorization";
import { Filter } from "./external-fetch-api";
import { Row, SortingState } from "@tanstack/react-table";

export type Theme = {
  background?: string;
  menuBackground?: string;
  textColor?: string;
};

export type ColumnMetadata = {
  column_name: string;
  displayName?: string;
  dataType?: string;
  [key: string]: any;
};

export type Menu = {
  id: string;
  title: string;
  path: string;
  logo?: string;
  components?: [];
};

export type Company = {
  id: string;
  name: string;
  defaultLanguage?: string;
  logo?: string;
  theme?: Theme;
  mobileMenu: Menu[];
};

export enum Device {
  Mobile,
  Desktop,
}

export type AppPage = {
  url: string;
  icon?: string;
  title: string;
  page?: React.ComponentType<any>;
  routeOnly?: boolean;
  exact?: boolean;
  allowedRoles?: RoleValues[];
  tableParentName?: string;
  tableMetadata?: ColumnMetadata[];
  selectQuery?: string;
  filterQuery?: Filter[];
  sortingQuery?: SortingState;
  searchColumn?: string[];
  nameContent?: Array<string>;
  children?: AppPage[];
  toggleOnly?: boolean;
  lookerUrl?: string;
  lookerUrlMobile?: string | null;
  onRowClicked?: (data: Row<any>) => void;
  globalFilterColumn?: Array<string>;
  platform?: ('desktop' | 'mobile')[];
};

export type Role = {
  id: string;
  name: string;
};

export type GroupConfig = {
  logo: string;
};
export type Group = {
  id: string;
  name: string;
  config: GroupConfig;
  slug: string;
};
export type UserRole = {
  role: Role;
  group: Group;
};

export type UserWithGroup =
  {
    group: UserRole[];
  };
