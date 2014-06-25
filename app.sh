#!/bin/sh

basedir=`dirname "$0"`
bin/node node_modules/sails/bin/sails.js lift &wait

