//CCS_UNIQUE TGFP3HN64DE
module.exports = {
  logging: {
    debugSQL: process.env.NODE_ENV == "development",
    apolloLogging: process.env.NODE_ENV == "development"
  }
};
