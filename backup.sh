#!/bin/bash

# Configuration variables
DB_NAME="activity_tracking"
BACKUP_DIR="/mnt/c/Users/kongh/Desktop/DATN/backups"
TIMESTAMP=$(date +%F_%H-%M-%S)
PORT="39990"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR/json_backup_$TIMESTAMP"

# Check if mongosh is installed
if ! command -v mongosh &>/dev/null; then
    echo "mongosh is not installed. Installing MongoDB tools..."

    # Add MongoDB repository
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    
    # Update and install mongosh
    sudo apt update
    sudo apt install -y mongodb-mongosh
fi

# Fetch the list of collections
collections=$(mongosh --port "$PORT" --quiet --eval "
    db = db.getSiblingDB('$DB_NAME');
    db.getCollectionNames().join('\n');
")

# Export each collection to JSON
if [ -z "$collections" ]; then
    echo "No collections found in database $DB_NAME."
    exit 1
fi

echo "Starting export of collections..."
for collection in $collections; do
    echo "Exporting collection: $collection"
    mongoexport --port "$PORT" --db "$DB_NAME" --collection "$collection" \
        --out "$BACKUP_DIR/json_backup_$TIMESTAMP/$collection.json" --jsonArray
done

echo "Backup completed successfully!"
echo "Backup location: $BACKUP_DIR/json_backup_$TIMESTAMP"
