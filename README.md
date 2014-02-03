nln-live
=========

A system for non linear performances with live musicians.

1 Installation instructions

2 Why did we make nln-live


1 Installation instructions

Prerequisites:

brew or apt-get

first run for brew:
-> brew update
-> brew doctor

With apt-get:
-> sudo add-apt-repository ppa:chris-lea/node.js
-> sudo apt-get update
-> sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
-> echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
-> sudo apt-get update


installing required packages:

npm and nodejs, to install with brew:
-> brew install node

With apt-get:
-> sudo apt-get install nodejs


mongodb, to install with brew:
brew install mongodb

with apt-get:
-> sudo apt-get install mongodb-10gen


sailsjs, to install on mac:
npm -g install sails

on ubuntu:
sudo npm -g install sails

Make sure the following directories are on your path (on macosx):
-> sudo vi /etc/paths
these should be in the file:
/usr/local/bin
/usr/local/share/npm/bin


Put the nln-live directory in a sensible place.
-> mongod
this started mongodb

open a new tab in terminal
-> mongo
-> use nln-live
ctrl-c to quit the mongo terminal

from the terminal browse to the directory and run:
-> npm update
-> npm install
this will download install all the javascript nodejs dependencies

then to start the server run:
-> node app.js
to compile with grunt and run:
-> sails lift app.js

the server is now running at
http://localhost:1337/index.html

To parse a directory with a piece,
paste the following in the browser after replacing the path parameter with an absolute path:
localhost:1337/piece/parsedir?path=/assets/pieces/stuk2

There are two pieces already in the package. If you want to import those
