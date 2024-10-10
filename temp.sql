CREATE TABLE "Tasks" (
  -- time in s since 1970???
	"id"	INTEGER NOT NULL UNIQUE,
	"parent"	INTEGER,
	"start"	INTEGER,
	"end"	INTEGER,
	"importance"	INTEGER,
	"description"	TEXT,
	"penalty_int"	INTEGER,
	"penalty_text"	TEXT,
	"reward_int"	INTEGER,
	"reward_text"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT),
);

-- Indexes for frequently queried columns
CREATE INDEX idx_tasks_parent ON "Tasks" ("parent");
CREATE INDEX idx_tasks_start ON "Tasks" ("start");

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