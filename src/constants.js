module.exports = {
  TOP_POST_LIKES_THRESHOLD: 3,
  // HOSTNAME: 'https://pinpot-service-191609172403.us-central1.run.app/',
  VERIFIED_USERNAME: 'verified',

  HOSTNAME:
    process.env.DEVELOPMENT === 'True' ? 'http://localhost:8000' : 'https://pinpots.onrender.com',
};
