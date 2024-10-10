import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, Button, Platform, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import Timer from './Timer';

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

export default function MainApp() { // App --> MainApp
  const defDBFilename = 'SQLiteTodo.db'; // default database filename
  const [db, setDb] = useState(SQLite.openDatabase(defDBFilename));
  const [isLoading, setIsLoading] = useState(true);
  // const [names, setNames] = useState([]); // JS
  // const [names, setNames] = useState<string | number | null | undefined>(null); // TypeScript BAD
  const [names, setNames] = useState<Name[]>([]); // TypeScript
  const [currentTaskName, setCurrentTaskName] = useState<string>("");

  const exportDb = async () => {
    if (Platform.OS === "android") {
      // exports to: `file:///data/user/0/host.exp.exponent/files/ExperienceData/%2540anonymous%252Fexpo-sqlite-tutorial-9d5e8030-24ea-4677-bc3b-400558688a21/SQLiteTodo.db`
      console.log(FileSystem.documentDirectory + defDBFilename); // DEBGUG -log path of database to Console
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(
          FileSystem.documentDirectory + defDBFilename,
          {
            encoding: FileSystem.EncodingType.Base64
          }
        );

        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, defDBFilename, 'application/octet-stream')
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, base64, { encoding : FileSystem.EncodingType.Base64 });
        })
        .catch((e) => console.log(e));
      } else {
        console.log("Permission not granted");
      }
    } else {
      await Sharing.shareAsync(FileSystem.documentDirectory + defDBFilename);
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

      await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + defDBFilename, base64, { encoding: FileSystem.EncodingType.Base64 });
      await db.closeAsync();
      setDb(SQLite.openDatabase(defDBFilename));
    }
  };

  useEffect(() => {
    // LOW priority, updat this later
    // LOW priority // db.transaction(tx => {
    // LOW priority //   tx.executeSql('CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)')
    // LOW priority // });

    db.transaction(tx => {
      // OLD DELETE when `names` is no longer in use // tx.executeSql('SELECT * FROM names', undefined,
      // OLD DELETE when `names` is no longer in use //   (txObj, resultSet) => setNames(resultSet.rows._array),
      // OLD DELETE when `names` is no longer in use //   (txObj, error) => { console.log(error); return false; } // TypeScript
      // OLD DELETE when `names` is no longer in use // );
      tx.executeSql('SELECT * FROM tasks', undefined,
        (txObj, resultSet) => setNames(resultSet.rows._array),
        (txObj, error) => { console.log(error); return false; } // TypeScript
      )
    });

    setIsLoading(false);
  }, [db]);

  if (isLoading) {
    return (
      <View>
        <Text>Loading names...</Text>
      </View>
    );
  }

  const addName = () => {
    db.transaction(tx => {
      // inserts `currentName` into the `names` table
      tx.executeSql('INSERT INTO names (name) values (?)', [currentTaskName],
        (txObj, resultSet) => {
          // if ( typeof currentName !== 'string' ) { console.error("currentName is not a string"); return; } // TypeScript
          if ( resultSet.insertId == undefined ) { console.error("Insert ID is undefined"); return; } // happens on: 1. SQL Statement Erorr, 2. no auto-increment primary-key, 3. transaction failure, 4. non-insert SQL operation
          else {
            let existingNames = [...names]; // names from `const [names, setNames] = useState([]);`
            existingNames.push({ id: resultSet.insertId, name: currentTaskName });
            setNames(existingNames); // this relies on `useEffect` setting all data on each operation, that is EXCESSIVE...
            // useEffect should NOT update the database... only display it
            setCurrentTaskName("");
          }
        },
        (txObj, error) => { console.log(error); return false; }
      );
    });
  }
  // LOW priority, high complexity, this method requires a lot of database interaction or new state variables... it might be best to implement it later. Look at "THE LINE OF CONCERN BELOW" to quickly get started
  // LOW priority, high complexity, //const addTaskWithDetails = () => {
  // LOW priority, high complexity, //  db.transaction(tx => {
  // LOW priority, high complexity, //    // inserts `currentTaskName` into the `names` table
  // LOW priority, high complexity, //    // "THE LINE OF CONCERN BELOW"
  // LOW priority, high complexity, //    tx.executeSql('INSERT INTO tasks (name, parent, start, end, template_duration, importance, description, penalty_int, penalty_text, reward_int, reward_text, use_count, status, type, icon_ref)) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [currentTaskName, parent, start, end, template_duration, importance, description, penalty_int, penalty_text, reward_int, reward_text, use_count, status, type, icon_ref],
  // LOW priority, high complexity, //      (txObj, resultSet) => {
  // LOW priority, high complexity, //        // LOW priority, optional error check // if ( typeof AAA !== CORRECT_TYPE ) { console.error("AAA is not a CORRECT"); return; }
  // LOW priority, high complexity, //        if ( resultSet.insertId == undefined ) { console.error("Insert ID is undefined"); return; } // happens on: 1. SQL Statement Erorr, 2. no auto-increment primary-key, 3. transaction failure, 4. non-insert SQL operation
  // LOW priority, high complexity, //        else {
  // LOW priority, high complexity, //          // `existingNames` will likely be removed as there is no need to track database data via a state variable/array, as the database will be re-fetched often, so why store it when it is not necessary/normal...
  // LOW priority, high complexity, //          // LOW priority, delete // let existingNames = [...names]; // names from `const [names, setNames] = useState([]);`
  // LOW priority, high complexity, //          // LOW priority, delete // existingNames.push({ id: resultSet.insertId, name: currentTaskName });
  // LOW priority, high complexity, //          // same as above, this is not necessary, nor logical, when directly accessing the database is the norm
  // LOW priority, high complexity, //          // LOW priority, delete // setNames(existingNames); // this relies on `useEffect` setting all data on each operation, that is EXCESSIVE... // I don't think this is necessary right now
  // LOW priority, high complexity, //          setCurrentTaskName(""); // <-- This change the 'New Task' input element's value to an empty string
  // LOW priority, high complexity, //        }
  // LOW priority, high complexity, //      },
  // LOW priority, high complexity, //      (txObj, error) => { console.log(error); return false; }
  // LOW priority, high complexity, //    );
  // LOW priority, high complexity, //  });
  // LOW priority, high complexity, //}
  // const `addName` method --> `addTask`
  // const addTask = () => {
  async function generateUniqueTaskId(db: SQLite.WebSQLDatabase): Promise<number> {
    // 1. First generate a new Unique ID
    // 2. Check if the ID is already in use. IF in use, start at step 1 again. ELSE, continue to step 3.
    // 3. Insert the new task into the database
    let isNotUniqueId = true;
    let newTaskId = 0;

    while (isNotUniqueId) {
      newTaskId = Math.floor(Math.random() * 2**32) - 2**31; // generate a random signed 4-byte number between -2^31 and 2^31-1 (-2,147,483,648 to 2,147,483,647)

      // Check if the ID is already in use
      isNotUniqueId = await new Promise((resolve, reject) => {
        db.transaction(tx => {
          tx.executeSql('SELECT * FROM tasks WHERE id = ?', [newTaskId],
            (txObj, resultSet) => {
              if (resultSet.rows.length > 0) { // ID is already in use
                resolve(true); // ID is not unique
              } else {
                resolve(false); // ID is unique
              }
            },
            (txObj, error) => { console.log(error); reject(error);
              // return false; // OLD: handles it gracefully but does nothing with the error
              throw new Error(`SQL Error: ${error.message}`) // NEW: throws an error, deliberately crashing the program (for now)
            }
          );
        });
      });
    }

    return newTaskId;
  }

  // addTask with title parameter
  const addTask = async (currentTaskName: string) => {
    const newTaskId = await generateUniqueTaskId(db);
    db.transaction(tx => {
      tx.executeSql('INSERT INTO tasks (id, title) values (?, ?)', [newTaskId, currentTaskName],
        (txObj, resultSet) => {
          // TODO update the display, usually via modifying a state variable, which causes a complete-refresh of the display (technically the containing component)
          return true; // There is no error checking for now // if ( resultSet.insertId == undefined ) { console.error("Insert ID is undefined"); return; }
        },
        (txObj, error) => { console.log(error); /* return false; */ throw new Error(`SQL Error: ${error.message}`); /* Throw an error to crash the program */ }
      );
    });
    // REMOVE. useless throw, then catch only to throw again...? it seems // try {
    // REMOVE. useless throw, then catch only to throw again...? it seems //   const newTaskId = await generateUniqueTaskId(db);
    // REMOVE. useless throw, then catch only to throw again...? it seems //   db.transaction(tx => {
    // REMOVE. useless throw, then catch only to throw again...? it seems //     tx.executeSql('INSERT INTO tasks (id, title) values (?, ?)', [newTaskId, currentTaskName],
    // REMOVE. useless throw, then catch only to throw again...? it seems //       (txObj, resultSet) => {
    // REMOVE. useless throw, then catch only to throw again...? it seems //         // TODO update the display, usually via modifying a state variable, which causes a complete-refresh of the display (technically the containing component)
    // REMOVE. useless throw, then catch only to throw again...? it seems //         return true; // There is no error checking for now // if ( resultSet.insertId == undefined ) { console.error("Insert ID is undefined"); return; }
    // REMOVE. useless throw, then catch only to throw again...? it seems //       },
    // REMOVE. useless throw, then catch only to throw again...? it seems //       (txObj, error) => { console.log(error); /* return false; */ throw new Error(`SQL Error: ${error.message}`); /* Throw an error to crash the program */ }
    // REMOVE. useless throw, then catch only to throw again...? it seems //     );
    // REMOVE. useless throw, then catch only to throw again...? it seems //   });
    // REMOVE. useless throw, then catch only to throw again...? it seems // }
    // REMOVE. useless throw, then catch only to throw again...? it seems // catch (error) {
    // REMOVE. useless throw, then catch only to throw again...? it seems //   console.error('Error adding task:', error);
    // REMOVE. useless throw, then catch only to throw again...? it seems //   throw error; // Re-throw the error to crash the program
    // REMOVE. useless throw, then catch only to throw again...? it seems // }
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
  }

  const deleteTask = async (id: number) => {
    // LOW priority - Check if row exists first before trying to delete row
    db.transaction(tx => {
      tx.executeSql('DELETE FROM tasts WHERE id = ?', [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            return true;
          }
        },
        (txObj, error) => { console.log(error); /* return false; */ throw new Error(`SQL Error: ${error.message}`); /* Throw an error to crash the program */ }
      );
    });
  }

  // Define the type of a task record, allow for all values to be optional apart from `id`, `title`, and `time_created` so that updateTask can be used easily
  type Task = {
    id: number, title: string, description: string | null,
    template_id: number | null, use_count: number | 0,
    time_created: number,
    parent: number | null, children: string | null,
    start: number | null , end: number | null, duration: number | null,
    importance: number | null, difficulty: number | null,
    penalty_int: number | null, penalty_text: string | null,
    reward_int: number | null, reward_text: string | null,
    status: number | 0,
    type: string | null,
    icon_ref: string | null,
  }

  const readTask = async (id: number): Promise<Task> => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM tasks WHERE id = ?', [id],
        (txObj, resultSet) => {
          if (resultSet.rows.length === 1) {
            return resultSet.rows.item(0) as Task;
          }
          else if (resultSet.rows.length > 1) {
            throw new Error ('Error reading task: Multiple rows returned');
          }
          else {
            throw new Error ('Error reading task: No rows returned');
          }
        },
        (txObj, error) => { console.log(error); /* return false; */ throw new Error(`SQL Error: ${error.message}`); /* Throw an error to crash the program */ }
      );
    });
  }

  const updateTask = async (task: Task) => {
    db.transaction(tx => {
      tx.executeSql('UPDATE tasks SET title = ?, description = ?, template_id = ?, use_count = ?, parent = ?, children = ?, start = ?, end = ?, duration = ?, importance = ?, difficulty = ?, penalty_int = ?, penalty_text = ?, reward_int = ?, reward_text = ?, status = ?, type = ?, icon_ref = ? ' +
        'WHERE id = ?', [task.title, task.description, task.template_id, task.use_count, task.parent, task.children, task.start, task.end, task.duration, task.importance, task.difficulty, task.penalty_int, task.penalty_text, task.reward_int, task.reward_text, task.status, task.type, task.icon_ref, task.id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected === 1) {
            return true;
          }
          else if (resultSet.rowsAffected > 1) {
            throw new Error ('Error updating task: Multiple rows affected');
          }
          else {
            throw new Error ('Error updating task: No rows affected');
          }
        },
        (txObj, error) => { console.log(error); /* return false; */ throw new Error(`SQL Error: ${error.message}`); /* Throw an error to crash the program */ }
      )
    });
  }

  // this method requires a lot of database interaction or new state variables... it might be best to implement it later. Look at "THE LINE OF CONCERN BELOW" to quickly get started
  const addTaskWithDetails = () => {
  db.transaction(tx => {
    // inserts `currentTaskName` into the `names` table
    // "THE LINE OF CONCERN BELOW"
    tx.executeSql('INSERT INTO tasks (name, parent, start, end, template_duration, importance, description, penalty_int, penalty_text, reward_int, reward_text, use_count, status, type, icon_ref)) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [currentTaskName, parent, start, end, template_duration, importance, description, penalty_int, penalty_text, reward_int, reward_text, use_count, status, type, icon_ref],
      (txObj, resultSet) => {
        // LOW priority, optional error check // if ( typeof AAA !== CORRECT_TYPE ) { console.error("AAA is not a CORRECT"); return; }
        if ( resultSet.insertId == undefined ) { console.error("Insert ID is undefined"); return; } // happens on: 1. SQL Statement Erorr, 2. no auto-increment primary-key, 3. transaction failure, 4. non-insert SQL operation
        else {
          // `existingNames` will likely be removed as there is no need to track database data via a state variable/array, as the database will be re-fetched often, so why store it when it is not necessary/normal...
          // LOW priority, delete // let existingNames = [...names]; // names from `const [names, setNames] = useState([]);`
          // LOW priority, delete // existingNames.push({ id: resultSet.insertId, name: currentTaskName });
          // same as above, this is not necessary, nor logical, when directly accessing the database is the norm
          // LOW priority, delete // setNames(existingNames); // this relies on `useEffect` setting all data on each operation, that is EXCESSIVE... // I don't think this is necessary right now
          setCurrentTaskName(""); // <-- This change the 'New Task' input element's value to an empty string
        }
      },
      (txObj, error) => { console.log(error); return false; }
    );
  });
  }

  const updateName = (id: number) => {
    db.transaction(tx => {
      tx.executeSql('UPDATE names SET name = ? WHERE id = ?', [currentTaskName, id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingNames = [...names];
            const indexToUpdate = existingNames.findIndex(name => name.id === id); // name is input for this lambda function
            existingNames[indexToUpdate].name = currentTaskName;
            setNames(existingNames);
            setCurrentTaskName("");
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
      {/* Why does timer have such a large horizontal spacing... */}
      {/* <Timer /> */}
      <TextInput value={currentTaskName} placeholder='name' onChangeText={setCurrentTaskName} />
      <Button title="Add Name" onPress={addName} />
      {showNames()}
      <Button title="Export Db" onPress={exportDb}/>
      <Button title="Import Db" onPress={importDb} />
      <StatusBar style="auto" />
    </View>
  );
}

// export default MainApp;  // App --> MainApp
