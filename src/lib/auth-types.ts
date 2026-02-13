/**
 * Extend Auth.js types to include our custom fields (id, username).
 *
 * This file uses module augmentation to add fields to the default
 * Auth.js User and Session types.
 */

import "next-auth";

declare module "next-auth" {
  interface User {
    username?: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      username: string;
    };
  }
}
