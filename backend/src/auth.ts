import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    // async sendResetPassword(data, request) {
    //   // Send an email to the user with a link to reset their password
    // },
  },
  database: new Database("database.sqlite"),

  /** if no database is provided, the user data will be stored in memory.
   * Make sure to provide a database to persist user data **/
});
