#!/bin/sh
# Based on: http://blog.caustik.com/2012/04/11/escape-the-1-4gb-v8-heap-limit-in-node-js/
SIZE=8192
DIR=`dirname $0`
echo "Starting node with heap size: $SIZE"
node --nouse_idle_notification --max_old_space_size=$SIZE $DIR/print-heap.js