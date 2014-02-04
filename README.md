nln-live
=========

A system for non linear performances with live musicians.

### Prerequisites:
##### [Node.js](https://www.google.nl/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&ved=0CDIQFjAA&url=http%3A%2F%2Fnodejs.org%2F&ei=lvjwUraxBqSw0QW9koHQCw&usg=AFQjCNE4Ts3F1ZWcYkLwsfNqE6RHZgUpyg&bvm=bv.60444564,d.d2k)
##### [npm](https://npmjs.org/)
##### [MongoDB](http://www.mongodb.org/)
##### [Sails.js](http://sailsjs.org/)

### installing required packages:

Packagemanager:
brew or apt-get

#### Before starting:
first run for brew: -> brew update -> brew doctor

With apt-get: -> sudo add-apt-repository ppa:chris-lea/node.js -> sudo apt-get update -> sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10 -> echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list -> sudo apt-get update


##### Node.js and npm
to install with brew:
-> brew install node

With apt-get:
-> sudo apt-get install nodejs

##### MongoDB
to install with brew:
-> brew install mongodb

with apt-get:
-> sudo apt-get install mongodb-10gen

##### sailsjs
to install on mac: npm -g install sails

on ubuntu: sudo npm -g install sails


#### After installing packages
Make sure the following directories are on your path (on macosx): -> sudo vi /etc/paths these should be in the file: /usr/local/bin /usr/local/share/npm/bin

Put the nln-live directory in a sensible place. Then execute from the terminal:
-> mongod
this started mongodb

open a new tab in terminal and execute:
-> mongo 
-> use nln-live
ctrl-c to quit the mongo terminal

browse to the directory where you pyt nln-live and run:
-> npm update
-> npm install
this will download install all the javascript Node.js dependencies

then to start the server run:
-> node app.js to compile with grunt and run: -> sails lift app.js

### Congratulations!
the server is now running at http://localhost:1337/index.html

#### Parse a piece
To parse a directory with a piece, paste the following in the browser after replacing the path parameter with an absolute path: localhost:1337/piece/parsedir?path=/assets/pieces/stuk2

There are two pieces already in the package. If you want to import those
