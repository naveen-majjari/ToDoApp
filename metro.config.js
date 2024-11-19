/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
module.exports = {
  resolver: {
    sourceExts: ["jsx", "js", "ts", "tsx"], // Add supported extensions
  },
  transformer: {
    babelTransformerPath: require.resolve(
      "react-native-typescript-transformer"
    ),
  },
};
