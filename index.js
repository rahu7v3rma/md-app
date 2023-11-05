/**
 * @format
 */

import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';

import { registerBackgroundNotificationsListener } from '@/services/notification';

import { name as appName } from './app.json';
import App from './src/App';

AppRegistry.registerComponent(appName, () => App);

registerBackgroundNotificationsListener();
