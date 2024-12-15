#!/bin/bash

DB_NAME="activity_tracking"
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%F_%T)
PORT="39990"

mongodump --port $PORT --db $DB_NAME --out $BACKUP_DIR/mongo_backup_$TIMESTAMP