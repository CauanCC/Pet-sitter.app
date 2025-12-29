export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  CreatePet: { petId?: string } | undefined;
  CreateBooking: undefined;
};

export type MainTabParamList = {
  Pets: undefined;
  CreateBooking: undefined;
  User: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

