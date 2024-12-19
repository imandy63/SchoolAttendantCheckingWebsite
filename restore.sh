#!/bin/bash

# Configuration
DB_NAME="activity_tracking"
BACKUP_BASE_DIR="/mnt/c/Users/kongh/Desktop/DATN/backups"
PORT="39990"

# Check if timestamp is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <timestamp>"
    exit 1
fi

TIMESTAMP=$1
BACKUP_DIR="$BACKUP_BASE_DIR/json_backup_$TIMESTAMP"

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo "Error: Backup directory $BACKUP_DIR does not exist."
    exit 1
fi

# Restore each collection from JSON files
for file in "$BACKUP_DIR"/*.json; do
    collection=$(basename "$file" .json)
    echo "Restoring collection: $collection"
    mongoimport --port "$PORT" --db "$DB_NAME" --collection "$collection" --file "$file" --jsonArray --drop
done

echo "Restore completed successfully!"
