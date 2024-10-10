README.md


## Explanation of SQLite Tables

### `tasks` Table
```sql
CREATE TABLE "tasks" (
  "id_time"  INTEGER NOT NULL UNIQUE,          -- Seconds since 1970
  "parent"  INTEGER,                          -- id (id_time) of parent task, NULL
  "start"    INTEGER,                          -- Seconds since 1970    now in JS TS (`new Date()`)
  "end"      INTEGER DEFAULT NULL,             -- Seconds since 1970    depends on if template duration, otherwise 8 minutes
  "template_duration"  INTEGER DEFAULT NULL,   -- Seconds
  "importance"  INTEGER,                      -- 1-6 : Study, Setup Coding Environment, Study for Exam,
  "description"  TEXT,                         -- Markdown HTML XML description
  "penalty_int"  INTEGER,                      -- 0-5 : 0 <-- fear is a great motivator, do not abuse the penalty system. 0.5 = get out of bed.
  "penalty_text"  TEXT DEFAULT NULL,          -- E.g. Put $50 in the shared meals jar. `Shared-meals + $50` <-- format for adding to a category
  "reward_int"  INTEGER,                      -- ??? !!! 0-5?
  "reward_text"  TEXT DEFAULT NULL,            -- f
  "use_count"    INTEGER DEFAULT NULL,         -- NULL = base task, 1+ = template task (currently there is no way of how recently these usages have occurred)
  "status"      INTEGER,                      -- f
  "type"        TEXT DEFAULT NULL,            -- ??? ***    I might not need this Medication, Chore, Study, Work
  "icon_ref"    TEXT,                         -- "Med-Red-Blue_Capsule", "Med-Red-White_Capsule", "Cannabis-Leaf", "Cannabis-Oil"
  PRIMARY KEY("id_time")
);
```
1 byte  = 2^8  = 256
2 bytes = 2^16 = 65,536
3 bytes = 2^24 = 16,777,216
4 bytes = 2^32 = 4,294,967,296 = 4E9 = 4.29 Billion
|--> 1970 + (4,294,967,296 / (60*60*24*365.25)) = 2106   MEANING 4 bytes can track the seconds from 1970 until the year 2106
|--> 1970 + (4,294,967,296 / (   60*24*365.25)) = 10,135 MEANING 4 bytes can track the minutes from 1970 until the year 10,135 // Thus seconds should do, as this app will likely not be used for 100 years
|--> The range of a 4 byte INTEGER in SQLite. Note: INTEGERs in SQLite are always signed, thus: -(2^31) to (2^31 - 1) == -2,147,483,648 to 2,147,483,647
```sql
CREATE TABLE "tasksPart2"
  "id"           !!! NEW  -- Random Number (4 bytes).                         : 4.29 billion possible values. If any record (even between different users is) the same, then they are incremented, their sub-tasks AND/OR parent-tasks are found and updated. This is very rarely happens and will lead to confusion 1 in a million times which can be easily fixed with a human search. 
  -- To demonstrate: Assume you have 3 devices A, B, and C. Device A is a phone, often out of internet coverage. Device B is the main PC/Server that is almost always connected to the internet. Device C is a PC at a club, which has unreliable wireless internet, that only works at 3-4am for some reason.
  -- All 3 devices have a record with an ID of 28.
  -- Lets say A's records is A-28, B's record is B-28, and C's record is C-28.
  -- Device A updates device C, this is on their local WiFi network, so device B does not know about this update.
  -- Device C acknowledges the update and sends an OK-BUT-UPDATE-THIS-TOO message to device B. This increments the ID of the record on device A from A-28 to A-29, and the ID of the record on device C remains at A-28.
  -- Currently: Device A has: C-28, A-29       | Device B has: B-28             | Device C has: C-28, A-29.
  -- Device A now encounters device B, and sends an update.
  -- Device B acknowledges the update and sends an OK-BUT-UPDATE-THIS-TOO message to device A. This increments the ID of the record on device A from C-28 to C-30, as it tries to use C-29, but that is taken by A-29.
  -- Currently: Device A has: C-28, A-29, B-30 | Device A has: C-28, A-29, B-30 | Device C has: C-28, A-29.
  -- Device C now updates device B, it receives and OK-NOTHING-NEW. Thus nothing conflicts.
  -- Device B now updates device C, it receives and OK. Thus nothing conflicts, record(s) are added.
  -- Currently: Device A has: C-28, A-29, B-30 | Device A has: C-28, A-29, B-30 | Device C has: C-28, A-29, B-30.
  -- A sends an update to B with record 1, this record's ID conflicts with record 2's ID on B, so B auto-increments record 1's ID to a unique number before adding record 1 (now record 1v2).
  -- B sends an update to A, and C with the updated record 1v2. This message is special, it tells A and C to update their record 1 to record 1v2.
  -- However this may cause C to update it's completely different record, thus all devices have a "push before pull" update system, that will not allow new data before uploading the old data??? <--- overkill???
  -- If record 1 on device A has the same ID as record 2 on device B, THEN if A sends an update to B, B will auto-increment record 2's ID before adding record 1.
  -- THEN If record 3 on device C has the same ID as record 1, record 2.
  "id_time"XXXXXX!!! OLD  -- Seconds since 1970 (4 bytes).
  "time_created" !!! NEW  -- Seconds since 1970 (4 bytes).                    : Will work from 1970 to 2106
  "device_id"    !!! NEW  -- 0-255 (1 byte)                                   : This helps prevent conflicts if you ever merge your database with an older copy 2^8 = 256
  "user_id"      !!! NEW  -- 0-64,536 (2 bytes)                               : OPTIONAL This helps prevent conflicts if you ever merge your database with another persons, this is a random number, and is not used in personal databases, only shared...?
  "parent"                -- ID of parent task (4 bytes)                      : If this column is not blank tasks will not render until their parents is found. This does beg the question of how database entries should be sorted, if they should be, for pagination advanced sorting is likely necessary.
  "children"     !!! NEW  -- ID of child tasks (list of 4 byte elements)
  "after"        !!! NEW  -- ID of prior task                                 : AFTER, not nesting, this should RARELY be used, but when you have a packed day, you might need to use it :)
  "start"                 -- Seconds since 1970 (4 bytes)    now in JS TS (`new Date()`)
  "end"                   -- Seconds since 1970    depends on if template duration, otherwise 8 minutes
  "template_duration"     -- Seconds
  "importance"            -- 1-6 : Study, Setup Coding Environment, Study for Exam,
  "title"        !!! NEW  -- Non-markdown title for easier searching
  "description"           -- Markdown HTML XML description
  "penalty_int"           -- 0-5 : 0 <-- fear is a great motivator, do not abuse the penalty system. 0.5 = get out of bed.
  "penalty_text"          -- E.g. Put $50 in the shared meals jar. `Shared-meals + $50` <-- format for adding to a category
  "reward_int"            -- ??? !!! 0-5?
  "reward_text"           -- f
  "use_count"             -- NULL = base task, 1+ = template task (currently there is no way of how recently these usages have occurred)
  "status"                -- f
  "type"                  -- ??? ***    I might not need this Medication, Chore, Study, Work
  "icon_ref"              -- "Med-Red-Blue_Capsule", "Med-Red-White_Capsule", "Cannabis-Leaf", "Cannabis-Oil"
  PRIMARY KEY("id_time")
);

-- how to store popularity and uses
-- this would involve tracking each usage by day, thus a method for storing that needs to be developed
-- 2x5-25, 3x5-26, 1x5-27, 1x5-28
```



### SQLite docs                  - https://www.sqlite.org/lang.html
### SQLite `CREATE TRIGGER` docs - https://www.sqlite.org/lang_createtrigger.html
https://www.sqlitetutorial.net/sqlite-case/
https://stackoverflow.com/questions/9356753/can-i-update-new-in-before-insert-trigger-in-sqlite - mentioned below
https://www.tutorialspoint.com/sqlite/sqlite_triggers.htm - these are ok tutorials, seemingly beginner, but not advanced tutorials. But easy to follow


You can NOT change the value of `NEW` using a `BEFORE INSERT` trigger in SQLite.
Instead you must use an `UPDATE` inside of an `AFTER INSERT` trigger. This is because `NEW` is read-only in a `BEFORE INSERT` trigger.
Here is the link for the code below (https://stackoverflow.com/questions/9356753/can-i-update-new-in-before-insert-trigger-in-sqlite):
```SQL
CREATE TRIGGER table_one_after_insert_trigger
AFTER INSERT ON table_one
FOR EACH ROW
WHEN (NEW.column_three IS NULL)
BEGIN
   UPDATE test SET column_three = now() WHERE id = NEW.id;
END;
```

### tasks_random_id_check
```SQL
CREATE TRIGGER tasks_random_id_check
BEFORE INSERT ON tasks
BEGIN
	SELECT CASE WHEN NEW.id ISNULL
		THEN id = (ABS(RANDOM()) % 4294967296) - 2147483648
	END;
END;
```














```sql
CREATE TABLE "tasksPart1" (
  "id_time"           -- *888                |                                   |                 |                  |                     |                   |                              |                             | ..CONTINUE BELOW..
  "device_id" !!! NEW -- *0                  |                                   |                 |                  |                     |                   |                              |                             | ..CONTINUE BELOW..
  "user_id"   !!! NEW -- *21,401             |                                   |                 |                  |                     |                   |                              |                             | ..CONTINUE BELOW..
  "parent"            -- *999                | __                                | \Setup Progra.. | __               | __                  | __                | __                           | \Write Emails to Electric.. | ..CONTINUE BELOW..
  "children"  !!! NEW -- ???                 | \Code for 20m \+\Code for 20m (2) |                 |                  |                     |                   |                              |                             | ..CONTINUE BELOW..
  "after"     !!! NEW -- __                  | __                                | __              | __               | __                  | \Code for 20m     | \Eat Lunch - Satay           | __                          | ..CONTINUE BELOW..
  "start"             -- 12:20pm             | 10:00am                           | __              | 4:45pm           | 12:00pm             | __                | __                           | 3:00pm                      | ..CONTINUE BELOW..
  "end"               -- 12:48pm             |                                   |                 |                  |                     |                   |                              |                             | ..CONTINUE BELOW..
  "template_duration" -- 28m                 | 15m                               | 20-40m          | 1h20             | 2m                  | 20m               | 30m                          | 10m                         | ..CONTINUE BELOW..
  "importance"        -- 6                   |                                   |                 |                  |                     |                   |                              |                             | ..CONTINUE BELOW..
  "description"       -- Write shopping list | Setup Programming Environment     | Code for 20m    | Do the gardening | Take Meds           | Eat Lunch - Satay | Write Emails to Electricians | Send Emails to Electricians | ..CONTINUE BELOW..
  "penalty_int"       -- 0                   | -1.0, $10                         | -0.1            | -0.3             | -0.1                | -0.1              | -0.2                         | -0.3                        | ..CONTINUE BELOW..
  "penalty_text"      -- ___                 |                                   |                 |                  |                     |                   |                              |                             | ..CONTINUE BELOW..
  "reward_int"        -- 0                   | 0.5                               | 0.2             | 0.7              | 0.1                 | 0.1               | 0.1                          | 0.4                         | ..CONTINUE BELOW..
  "reward_text"       -- ___                 |                                   |                 |                  |                     |                   |                              |                             | ..CONTINUE BELOW..
  "use_count"         -- 1                   | 23                                | 37              | 2                | 300                 | 18                | 1                            | 1                           | ..CONTINUE BELOW..
  "status"            -- IN PROGRESS         | 1 (IN PROGRESS)                   | 0 (NOT STARTED) | 0 (NOT STARTED)  | 2 (COMPLETED)       | 0 (NOT STARTED)   | 0 (NOT STARTED)              | 0 (NOT STARTED)             | ..CONTINUE BELOW..
  "type"              -- Chore               | Study                             | Study           | Chore            | Medication          |                   | Work                         | *Difficult* Work            | ..CONTINUE BELOW..
  "icon_ref"          -- "Pen-n-Paper"       | "Stacking-Lego"                   | "Monitor"       | "Trowel"         | "Green...\+Pink..." | "Food-Plate"      | "Email""Writing"             | "Email"                     | ..CONTINUE BELOW..
  PRIMARY KEY("id_time")
);
CREATE TABLE "tasksPart2" (
  "id_time"   !!! OLD -- |                          |                               |                               |                             |                 | -- Minutes since 1970.
  "id"        !!! NEW -- |                          |                               |                               |                             |                 | -- Random Number (4 bytes). 4.29 billion possible values. If any record (even between different users is) the same, then they are incremented, their sub-tasks AND/OR parent-tasks are found and updated. This is very rarely happens and will lead to confusing 1 in a million times which can be fixed with a human search.
  "time_created" !NEW -- |                          |                               |                               |                             |                 | -- Minutes since 1970 (4 bytes). Will work from 1970 to 10,135
  "device_id" !!! NEW -- |                          |                               |                               |                             |                 | -- 0-255    : This helps prevent conflicts if you ever merge your database with an older copy 2^8 = 256
  "user_id"   !!! NEW -- |                          |                               |                               |                             |                 | -- 0-64,536 : ??? This helps prevent conflicts if you ever merge your database with another persons, this is a random number, and is not used in personal databases, only shared...?
  "parent"            -- | __                       | \Get dressed for Exercize     | __                            | __                          |                 | -- `id_time` of parent task. If this column is not blank tasks will not render until their parents is found. This does beg the question of how database entries should be sorted, if they should be, for pagination advanced sorting is likely necessary.
  "children"  !!! NEW -- |                          |                               |                               | NULL                        |                 | -- `id_time` of child tasks
  "after"     !!! NEW -- | __                       | __                            | __                            | __                          |                 | -- AFTER, not nesting, this should RARELY be used, but when you have a packed day, you might need to use it :)
  "start"             -- | 10:20pm                  | __                            | 4d 6h                         | 11:20am                     |                 | -- Seconds since 1970    now in JS TS (`new Date()`)
  "end"               -- |                          |                               |                               |                             |                 | -- Seconds since 1970    depends on if template duration, otherwise 8 minutes
  "template_duration" -- | 10m                      | 10-30m                        | 6h20m                         | 30m                         |                 | -- Seconds
  "importance"        -- |                          |                               |                               |                             |                 | -- 1-6 : Study, Setup Coding Environment, Study for Exam,
  "title"             -- |
  "description"       -- | Get dressed for Exercize | Run 3 Laps, Walk 2, 20 Squats | Finish Math Assignment        | Play Atomicrops (I need it) | Play Atomicrops | -- Markdown HTML XML description
  "penalty_int"       -- | -0.3                     | -0.3                          | -0.8                          | 0.1                         | 0.0             | -- 0-5 : 0 <-- fear is a great motivator, do not abuse the penalty system. 0.5 = get out of bed.
  "penalty_text"      -- | -$10                     |                               | -$10                          |                             |                 | -- E.g. Put $50 in the shared meals jar. `Shared-meals + $50` <-- format for adding to a category
  "reward_int"        -- | 0.2                      | 0.2                           | 1.0                           | 0.1                         | 0.0             | -- ??? !!! 0-5?
  "reward_text"       -- |                          |                               | $80 keyboard OR $30 Dark Tide |                             |                 | -- f
  "use_count"         -- | 3                        | 4                             | 1                             | 7                           | 16              | -- NULL = base task, 1+ = template task (currently there is no way of how recently these usages have occurred)
  "status"            -- | 0 (NOT STARTED)          | 0 (NOT STARTED)               | 0 (NOT STARTED)               | 2 (COMPLETED)               | 2 (COMPLETED)   | -- f
  "type"              -- | Chore-Exercize           | Chore-Exercize                | *Difficult* Work              | Important Leisure           | Leisure         | -- ??? ***    I might not need this Medication, Chore, Study, Work
  "icon_ref"          -- | "Small-Dumbell+Red-Dr.." | "Small-Dumbell"               | "Pi-Symbol\+Notepad"          | "Gamepad\+Brain"            | "Gamepad"       | -- "Med-Red-Blue_Capsule", "Med-Red-White_Capsule", "Cannabis-Leaf", "Cannabis-Oil"
  PRIMARY KEY("id_time")
);
```
   So there are a couple issues here
Rewards   are decimal values (0.1)  default <-- this is partially so the "daily tally" is easy to view
Penalties are decimal values (-0.1) default <-- this is partially so the "daily tally" is easy to view
#### "Daily Tally"
```
|| ============================================= ||        
|| ==========| Today | Avrg. | Goal | ========== ||        
|| #Tasks    :   10  |   10  |  10  |            ||      <--- this looks like the current goal
|| #Missed   :   4   |   4   |      |            ||        
|| Mood      :   4.9 |   4.8 |      |            ||        
|| Penalties : - 0.3 | - 0.3 |      |            ||      <--- this looks like the current goal
||           : -$4.0 | -$3.8 |      |            ||        
|| Rewards   :   1.0 |   1.0 |  1.0 |            ||      <--
||           :  $10  |  $5   |      |            ||        
||           : *4x Jarra Planks (400x100x20mm)   ||        
|| ============================================= ||        
|| ============================================= ||        


|| ============================================= ||        
|| ==========| Today | Avrg. | Goal | ========== ||        
|| #Tasks    :   10  |   10  |  10  |            ||      <--- this looks like the current goal
||                   |       |      |            ||        
|| #Missed   :   4   |   4   |      |            ||        
||                   |       |      |            ||        
|| Mood      :   4.9 |   4.8 |      |            ||        
||                   |       |      |            ||        
|| Penalties : - 0.3 | - 0.3 |      |            ||      <--- this looks like the current goal
||                   |       |      |            ||        
||           : -$4.0 | -$3.8 |      |            ||        
||                   |       |      |            ||        
|| Rewards   :   1.0 |   1.0 |  1.0 |            ||      <--
||                   |       |      |            ||        
||           :  $10  |  $5   |      |            ||        
||                   |       |      |            ||        
||           : *4x Jarra Planks (400x100x20mm)   ||        
||                   |       |      |            ||        
|| ============================================= ||        
|| ============================================= ||        
```
Rewards, Punishments are low, to keep things simple, however as they are dot-points it makes them harder to type, longer to look at.

essential habit <-- e.g. `Wakeup by 9am...`, get out of bed, code by 10am. Penalty 1 = $15


template tasks? frequency?

status 0 = pending
status 1 = done
status 2 = template task (adjust as needed) e.g. (Take morning vyvanse 20mg at 8am)

type medication
type chore
type study
type work

icon_ref "Med-Red-Blue_Capsule"
icon_ref "Med-Red-White_Capsule"
icon_ref "Cannabis-Leaf"
icon_ref "Cannabis-Oil"


Hi again, you gave me advice on the structure of my database's tasks table before, but I have questions.

I am wondering what type `children` should be, as `children` stores a list of `id`s, which are `INTEGER`s (in an SQLite Database).
Also I am wondering how `TEXT` types work, as SQLite databases apparently do not use compression. Thus 1. how does the `TEXT` type work if you have a very long string in a minority of rows? 2. how does the `TEXT` type work if you have mostly blank strings with a minority of very long, medium length strings?