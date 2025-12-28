export type RootStackParamList = {
  Home: undefined;
  Owner: undefined;
};

export type OwnerStackParamList = {
  OwnerHome: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

