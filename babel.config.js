module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'module:react-native-dotenv', // Plugin para manejar variables de entorno
      'react-native-reanimated/plugin' // Plugin para reanimated
    ]
  };
};
