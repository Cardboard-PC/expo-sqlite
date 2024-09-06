import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Platform, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import Timer from './Timer';

import MainApp from './MainApp';
import Task, { TaskProps } from './Task';
// import TaskProps from './Task';

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


const Task_Demo = () => {
  // const [direction, setDirection] = useState('ltr');
  // !!!!! `new Date(new Date().getDate() + 1)` is BUGGED !!!!
  // const startTime1 = new Date(new Date().setDate(new Date().getDate() + 1));    startTime1.setHours( 7, 0, 0, 0);  //  7:00am today
  // const startTime2 = new Date(new Date().setDate(new Date().getDate() + 1));    startTime2.setHours( 9, 0, 0, 0);  //  9:00am today
  // const startTime3 = new Date(new Date().setDate(new Date().getDate() + 1));    startTime3.setHours(11, 0, 0, 0);  // 11:00am today
  // const dueTime1   = new Date(new Date().setDate(new Date().getDate() + 1));      dueTime1.setHours(23, 0, 0, 0);  // 11:00pm today
  // const dueTime2   = new Date(new Date().setDate(new Date().getDate() + 1));      dueTime2.setHours(23, 30, 0, 0); // 11:30pm today
  // const dueTime3   = new Date(new Date().setDate(new Date().getDate() + 1)); dueTime3.setHours(23, 30, 0, 0); // 11:30pm tomorrow
  const startTime1 = new Date();    startTime1.setHours( 7, 0, 0, 0);  //  7:00am today
  const startTime2 = new Date();    startTime2.setHours( 9, 0, 0, 0);  //  9:00am today
  const startTime3 = new Date();    startTime3.setHours(11, 0, 0, 0);  // 11:00am today
  const dueTime1   = new Date();      dueTime1.setHours(23, 0, 0, 0);  // 11:00pm today
  const dueTime2   = new Date();      dueTime2.setHours(23, 30, 0, 0); // 11:30pm today
  const dueTime3   = new Date(new Date().setDate(new Date().getDate() + 1)); dueTime3.setHours(23, 30, 0, 0); // 11:30pm tomorrow

  return (
    <View style={styles.container}>
      {/* File Identifier */}
      <Text>Android Header Spacer</Text>
      <Text>Task_Demo.tsx</Text>
      {/* <MainApp /> */}
      <Task
        label="CD 1"
        startDate={startTime1}
        dueDate={dueTime1}
        displayNumHoursOfNextDay={12}>
      </Task>
      <Task
        label="CD 2"
        startDate={startTime2}
        dueDate={dueTime2}
        displayNumHoursOfNextDay={12}>
      </Task>
      <Task
        label="CD 3"
        startDate={startTime3}
        dueDate={dueTime3}
        displayNumHoursOfNextDay={12}>
      </Task>
      <Task
        label="CD 4"
        startDate={startTime3}
        dueDate={dueTime3}
        displayNumHoursOfNextDay={12}>
      </Task>
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

export default Task_Demo;

