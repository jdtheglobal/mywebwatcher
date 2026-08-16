const { OAuth2Client } = require('google-auth-library');
try {
  const client = new OAuth2Client(undefined);
  console.log("Success");
} catch (e) {
  console.error("Crash:", e.message);
}
