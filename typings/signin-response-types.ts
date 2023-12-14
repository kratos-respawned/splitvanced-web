export type SignInResponse =
  | {
      status: "authenticated";
      user: {
        id: string;
        email: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  | {
      status: "unauthenticated";
      error: string;
    }
  | {
      status: "unverified";
      error: string;
    };
