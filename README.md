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


Put the nln-live directory in a sensible place.


from the terminal browse to the directory and run:
-> npm update
-> npm install
this will download install all the javascript nodejs dependencies

then to start the server run:
-> node app.js
to compile with grunt and run:
-> sails lift app.js

the server is now running at
http://localhost:1337