#!/bin/bash

set -o pipefail

while true; do
    node GenesisBot.js 2>&1 | tee -a logs/gb_logs.log
    if [ $? -eq 14 ]
    then
        echo '[supervisor] Exiting from GenesisBot' | tee -a logs/gb_logs.log
        break
    else
        echo '[supervisor] Restarting GenesisBot' | tee -a logs/gb_logs.log
        sleep 3
    fi
done
