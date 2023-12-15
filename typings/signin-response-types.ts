export type SignInResponse =
  | {
      status: "authenticated";
      user: ClientUser;
    }
  | {
      status: "unauthenticated";
      error: string;
    }
  | {
      status: "unverified";
      error: string;
    };

export type ClientUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
};
