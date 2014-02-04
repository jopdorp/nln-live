nln-live
=========

A system for non linear performances with live musicians.

## Required packages:
* [Node.js](https://www.google.nl/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&ved=0CDIQFjAA&url=http%3A%2F%2Fnodejs.org%2F&ei=lvjwUraxBqSw0QW9koHQCw&usg=AFQjCNE4Ts3F1ZWcYkLwsfNqE6RHZgUpyg&bvm=bv.60444564,d.d2k)
* [npm](https://npmjs.org/)
* [MongoDB](http://www.mongodb.org/)
* [Sails.js](http://sailsjs.org/)

## Installing required packages:

Packagemanager:
brew or apt-get

### Before starting:
First run in the terminal for brew:
* -> brew update
* -> brew doctor

With apt-get: 
* -> sudo add-apt-repository ppa:chris-lea/node.js
* -> sudo apt-get update
* -> sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
* -> echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
* -> sudo apt-get update

### The packages:

#### Node.js and npm
To install with brew:
* -> brew install node

With apt-get:
* -> sudo apt-get install nodejs

#### MongoDB
To install with brew:
* -> brew install mongodb

With apt-get:
* -> sudo apt-get install mongodb-10gen

#### sailsjs
* To install on mac: npm -g install sails

* On ubuntu: sudo npm -g install sails


### After installing packages
Make sure the following directories are on your path (on macosx): 
* -> sudo vi /etc/paths 
The following paths should be in the file:
* /usr/local/bin 
* /usr/local/share/npm/bin

Put the nln-live directory in a sensible place. Then execute from the terminal:
* -> mongod
This started mongodb

Open a new tab in terminal and execute:
* -> mongo 
* -> use nln-live
Ctrl-c to quit the mongo terminal

Browse to the directory where you put nln-live and run:
* -> npm update
* -> npm install
This will download install all the javascript Node.js dependencies

Then to start the server run:
* -> node app.js
To compile with grunt and run:
* -> sails lift app.js

## Congratulations!
**The server is now running at http://localhost:1337/index.html**

#### One step to go! Parse a piece
To parse a directory with a piece, paste the following in the browser after replacing the path parameter with an absolute path:
* localhost:1337/piece/parsedir?path=/assets/pieces/stuk2

There are two pieces already in the package. If you want to import those prepend the above path with the absolute path to your nln-live directory
The second piece is called "stuk1" just raplace "stuk2" with "stuk1"
