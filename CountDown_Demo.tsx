import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Platform, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import Timer from './Timer';

import MainApp from './MainApp';
import CountDown, { CountDownProps } from './CountDown';
// import CountDownProps from './CountDown';

// expo add expo-sqlite
// expo add expo-file-system
// expo add expo-document-picker
// expo add expo-sharing
// expo add expo-dev-client

/*
  For testing expo-document-picker on iOS we need a standalone app
  which is why we install expo-dev-client

  If you don't have eas installed then install using the following command:
  npm install -g eas-cli

  eas login
  eas build:configure

  Build for local development on iOS or Android:
  eas build -p ios --profile development --local
  OR
  eas build -p android --profile development --local

  May need to install the following to build locally (which allows debugging)
  npm install -g yarn
  brew install fastlane

  After building install on your device:
  For iOS (simulator): https://docs.expo.dev/build-reference/simulators/
  For Android: https://docs.expo.dev/build-reference/apk/

  Run on installed app:
  expo start --dev-client
*/


const CountDown_Demo = () => {
  // const [direction, setDirection] = useState('ltr');
  const dueTime1 = new Date();    dueTime1.setHours(23, 0, 0, 0);  // 11:00pm
  const dueTime2 = new Date();    dueTime2.setHours(23, 30, 0, 0); // 11:30pm

  return (
    <View style={styles.container}>
      {/* <MainApp /> */}
      <Text>Hello</Text>
      <CountDown
        label="CD 1"
        dueTime={dueTime1}>
      </CountDown>
      <CountDown
        label="CD 2"
        dueTime={dueTime2}>
      </CountDown>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    // flexDirection: 'row',
    flexWrap: 'wrap', // causes auto-sizing to work in both directions, rather than just one (vertical by default)
    // don't think this works
    // flexShrink: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});

export default CountDown_Demo;

