import path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  entry: './src/index.tsx', // Point d'entrée de votre application
  output: {
    filename: 'bundle.js', // Nom du fichier de sortie
    path: path.resolve(__dirname, 'dist'), // Répertoire de sortie
  },
  module: {
    rules: [
      {
	test: /\.json$/,
        loader: 'json-loader',
        test: /\.(ts|tsx)$/, // Extension des fichiers à traiter (TypeScript/React)
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader', // Chargeur TypeScript pour transpiler votre code
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'], // Extensions de fichiers à résoudre automatiquement
  },
};

export default config;

