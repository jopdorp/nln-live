nln-live
=========

A system for non linear performances with live musicians.

1 Installation instructions

2 Why did we make nln-live


1 Installation instructions

Prerequisites:

nodejs, to install with brew:
brew install node

npm

mongodb, to install with brew:
brew install mongodb

sailsjs, to install:
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