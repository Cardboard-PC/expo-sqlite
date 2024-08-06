import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Platform, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

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

interface Name {
  id: number;
  name: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // https://styled-components.com/docs/basics
  // alignSelf: 'stretch',
  // justifyContent: 'space-between',
  // justifyContent: 'space-evenly',
  // justifyContent: 'flex-end',
  // flexGrow: 2, // causes it to fill 2 parts of the whole
  // flexGrow: 2, // causes it to fill 3 parts of the total
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginHorizontal: 10,
    marginVertical: 3,
  },
  uDButton: {
    // padding: 20,
    marginHorizontal: 5,
    backgroundColor: '#f00000',
  },
  rowName: {
    flexGrow: 2, // causes it to grow
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  }
});

export default function App() {
  const [db, setDb] = useState(SQLite.openDatabase('example.db'));
  const [isLoading, setIsLoading] = useState(true);
  // const [names, setNames] = useState([]); // JS
  // const [names, setNames] = useState<string | number | null | undefined>(null); // TypeScript BAD
  const [names, setNames] = useState<Name[]>([]); // TypeScript
  const [currentName, setCurrentName] = useState<string>("");

  const exportDb = async () => {
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(
          FileSystem.documentDirectory + 'SQLite/example.db',
          {
            encoding: FileSystem.EncodingType.Base64
          }
        );

        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, 'example.db', 'application/octet-stream')
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, base64, { encoding : FileSystem.EncodingType.Base64 });
        })
        .catch((e) => console.log(e));
      } else {
        console.log("Permission not granted");
      }
    } else {
      await Sharing.shareAsync(FileSystem.documentDirectory + 'SQLite/example.db');
    }
  }

  const importDb = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true
    });

    if (result.type === 'success') {
      setIsLoading(true);

      if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
      }

      const base64 = await FileSystem.readAsStringAsync(
        result.uri,
        {
          encoding: FileSystem.EncodingType.Base64
        }
      );

      await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + 'SQLite/example.db', base64, { encoding: FileSystem.EncodingType.Base64 });
      await db.closeAsync();
      setDb(SQLite.openDatabase('example.db'));
    }
  };

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)')
    });


    db.transaction(tx => {
      tx.executeSql('SELECT * FROM names', undefined,
        (txObj, resultSet) => setNames(resultSet.rows._array),
        // (txObj, error) => console.log(error) // JavaScript
        (txObj, error) => { console.log(error); return false; } // TypeScript
      );
    });

    setIsLoading(false);
  }, [db]);

// <View style={styles.container}>

  if (isLoading) {
    return (
      <View>
        <Text>Loading names...</Text>
      </View>
    );
  }

  const addName = () => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO names (name) values (?)',
        [currentName],
        (txObj, resultSet) => {
          // if ( typeof currentName !== 'string' ) { console.error("currentName is not a string"); return; } // TypeScript
          if ( resultSet.insertId == undefined ) { console.error("Insert ID is undefined"); return; } // happens on: 1. SQL Statement Erorr, 2. no auto-increment primary-key, 3. transaction failure, 4. non-insert SQL operation
          else {
            let existingNames = [...names]; // names from `const [names, setNames] = useState([]);`
            existingNames.push({ id: resultSet.insertId, name: currentName });
            setNames(existingNames);
            setCurrentName("");
          }
        },
        (txObj, error) => { console.log(error); return false; }
      );
    });
  }

  const deleteName = (id: number) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM names WHERE id = ?', [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingNames = [...names].filter(name => name.id !== id);
            setNames(existingNames);
          }
        },
        (txObj, error) => { console.log(error); return false; }
      );
    });
  };

  const updateName = (id: number) => {
    db.transaction(tx => {
      tx.executeSql('UPDATE names SET name = ? WHERE id = ?', [currentName, id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingNames = [...names];
            const indexToUpdate = existingNames.findIndex(name => name.id === id); // name is input for this lambda function
            existingNames[indexToUpdate].name = currentName;
            setNames(existingNames);
            setCurrentName("");
          }
        },
        (txObj, error) => { console.log(error); return false; }
      );
    });
  };

  const showNames = () => {
    return names.map((name, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.rowName}>{name.name}</Text>
          <View style={styles.uDButton}><Button title='Delete' onPress={() => deleteName(name.id)} /></View>
          <Button title='Update' onPress={() => updateName(name.id)} />
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <TextInput value={currentName} placeholder='name' onChangeText={setCurrentName} />
      <Button title="Add Name" onPress={addName} />
      {showNames()}
      <Button title="Export Db" onPress={exportDb}/>
      <Button title="Import Db" onPress={importDb} />
      <StatusBar style="auto" />
    </View>
  );
}


