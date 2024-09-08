module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // plugins: ['module:expo-image-picker'],
    plugins: [
      ['module:react-native-dotenv'],
    ]
  };
};
