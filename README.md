nln-live
=========

A system for live non linear and interactive instrumental music performances.

# Quickstart

-> sh app.sh

## Congratulations!
**The server is now running at http://localhost:1337/index.html#page/menu**

#### One step to go! Parse a piece
To parse a directory with a piece, paste the following in the browser after replacing the path parameter with an absolute path:
* localhost:1337/piece/parsedir?path=/assets/pieces/stuk2

There are four pieces already in the package. If you want to import those prepend the above path with the absolute path to your nln-live directory, for example:
* localhost:1337/piece/parsedir?path=/Users/your-user-name/GitHub/nln-live/assets/pieces/stuk2

The second piece is called "stuk1" just replace "stuk2" with "stuk1"
