#!/bin/sh

basedir=`dirname "$0"`
cd $basedir/data
bin/node node_modules/sails/bin/sails.js lift &wait

