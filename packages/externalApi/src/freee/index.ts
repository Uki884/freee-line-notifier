import * as auth from "./auth";
import * as company from "./company";
import * as deal from "./deal";
import * as user from "./user";
import * as wallet from "./wallet";

export const freeeApi = {
  ...auth,
  ...company,
  ...deal,
  ...user,
  ...wallet,
};

export * from "./constants";
