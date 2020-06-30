module.exports = {
    development: {
      port: process.env.PORT || 3000,
      dbURL: `mongodb+srv://user:softuni@exam-9z6yi.mongodb.net/plays?retryWrites=true&w=majority`,
      cookie: "auth_cookie",
      privateKey: "secret_key",
    },
    production: {},
}
  