import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";

import Database from "better-sqlite3";

export const auth = betterAuth({
  database: new Database("./sqlite.db"),
  emailAndPassword: {
    enabled: true,
    sendEmailVerificationOnSignUp: true,
    async sendVerificationEmail() {
      console.log("Send email to verify email address");
    },
    async sendResetPassword(url, user) {
      console.log("Send email to reset password");
    },
  },
  socialProviders: {},
  plugins: [twoFactor(), passkey()],
});
