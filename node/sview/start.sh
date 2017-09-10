#!/bin/sh

sleep 10

cd /home/pi/prg/node/sview
node sview.js>>log.txt &
