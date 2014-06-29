(function() {
  var Graph, heap, _;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] == item) return i;
    }
    return -1;
  };

  _ = require('underscore');
  heap = require('./vendor/heap.js');
  Graph = (function() {
    function Graph(opts) {
      var _ref, _ref2;
      if (opts == null) {
        opts = {};
      }
      this.vertices = {};
      this.directed = (_ref = opts.directed) != null ? _ref : true;
      this.uniform = (_ref2 = opts.uniform) != null ? _ref2 : false;
      if (opts.edges) {
        this.load(opts.edges);
      }
    }
    Graph.prototype.add_vertex = function(label) {
      if (!(label in this.vertices)) {
        return this.vertices[label] = {};
      }
    };
    Graph.prototype.connect = function(v1, v2, weight, label) {
      var edge;
      if (weight == null) {
        weight = 1;
      }
      if (label == null) {
        label = _.uniqueId('edge_');
      }
      if (v1 in this.vertices && v2 in this.vertices) {
        edge = {
          weight: weight,
          label: label
        };
        if (__indexOf.call(this.vertices[v1], v2) < 0) {
          this.vertices[v1][v2] = edge;
        }
        if (!this.directed && __indexOf.call(this.vertices[v2], v1) < 0) {
          return this.vertices[v2][v1] = edge;
        }
      }
    };
    Graph.prototype.disconnect = function(v1, v2) {
      delete this.vertices[v1][v2];
      if (!this.directed) {
        return delete this.vertices[v2][v1];
      }
    };
    Graph.prototype.load = function(edges, clean) {
      var label, v1, v2, weight, _i, _len, _ref;
      if (clean == null) {
        clean = true;
      }
      if (clean) {
        this.vertices = {};
      }
      for (_i = 0, _len = edges.length; _i < _len; _i++) {
        _ref = edges[_i], v1 = _ref[0], v2 = _ref[1], weight = _ref[2], label = _ref[3];
        if (!(v1 in this.vertices)) {
          this.add_vertex(v1);
        }
        if (!(v2 in this.vertices)) {
          this.add_vertex(v2);
        }
        this.connect(v1, v2, weight, label);
      }
      return this;
    };
    Graph.prototype.get_path = function(start, goal, with_dist) {

      var MAX_ITER = 10000;

      var child, children, cur_dist, cur_path, cur_v, h, new_dist, new_path, q, seen, visited, x, _ref, _ref2;
      if (with_dist == null) {
        with_dist = false;
      }


      if (this.uniform) {
        seen = {};
        q = (function() {
          var _results;
          _results = [];
          for (child in this.vertices[start]) {
            _results.push([child, [start]]);
          }
          return _results;
        }).call(this);
          x = 0;
        var foundPaths = [];

        for (var i = 0; i < MAX_ITER && q.length; i++) {
          _ref = _.head(q), cur_v = _ref[0], cur_path = _ref[1];
          q = _.tail(q);
          new_path = cur_path.slice();
          new_path.push(cur_v);
          if(foundPaths[0] && foundPaths[0].length < new_path.length){
            return foundPaths[Math.floor(Math.random()*foundPaths.length)];
          }

          if (__indexOf.call(goal,cur_v) !== -1) {
            if (with_dist) {
              foundPaths.push([new_path, cur_dist]);
            } else {
              foundPaths.push(new_path);
            }
          }
          for (child in this.vertices[cur_v]) {
            if (!(child in seen)) {
              q.push([child, new_path]);
              seen[child] = 1;
            }
          }
        }
        return null;
      } else {
        seen = {};
        visited = {};
        visited[start] = 1;
        h = new heap.BinaryHeap(function(e) {
          return e[1];
        });
        children = this.vertices[start];
        for (child in children) {
          h.push([child, children[child].weight, [start]]);
        }

        var foundPaths = [];
        for (var i = 0; i < MAX_ITER && h.size();i++) {
          _ref2 = h.pop(), cur_v = _ref2[0], cur_dist = _ref2[1], cur_path = _ref2[2];
          visited[cur_v] = 1;
          new_path = cur_path.slice();
          new_path.push(cur_v);
          if(foundPaths[0] && foundPaths[0].length < new_path.length){
            return foundPaths[Math.floor(Math.random()*foundPaths.length)];
          }
          if (__indexOf.call(goal,cur_v) !== -1) {
            if (with_dist) {
                foundPaths.push([new_path, cur_dist]);
            } else {
                foundPaths.push(new_path);
            }
          }
          children = this.vertices[cur_v];
          for (child in children) {
            if (!(child in visited)) {
              new_dist = cur_dist + children[child].weight;
              if (child in seen) {
                if (new_dist < seen[child][1]) {
                  seen[child][1] = new_dist;
                  h.bubbleUp(seen[child]);
                }
              } else {
                h.push([child, new_dist, new_path]);
              }
            }
          }
        }
        return null;
      }
    };
    Graph.prototype.dfs = function(pre, post) {
      var vertex, visited, _results;
      visited = {};
      _results = [];
      for (vertex in this.vertices) {
        if (!(vertex in visited)) {
          _results.push(this._dfs_visit(vertex, visited, pre, post));
        }
      }
      return _results;
    };
    Graph.prototype._dfs_visit = function(vertex, visited, pre, post) {
      var child, current, queue, _results;
      queue = [];
      queue.push(vertex);
      _results = [];
      while (queue.length) {
        current = queue.shift();
        visited[current] = 1;
        if (typeof pre === "function") {
          pre(current);
        }
        for (child in this.vertices[vertex]) {
          if (!(child in visited)) {
            this._dfs_visit(child, visited, pre, post);
          }
        }
        _results.push(typeof post === "function" ? post(current) : void 0);
      }
      return _results;
    };
    Graph.prototype.tsort = function() {
      var sorted;
      sorted = [];
      this.dfs(null, function(vertex) {
        return sorted.unshift(vertex);
      });
      return sorted;
    };
    return Graph;
  })();
  exports.Graph = Graph;
}).call(this);
