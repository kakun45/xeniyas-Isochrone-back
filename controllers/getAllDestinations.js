class PQ {
  constructor() {
    this.arrPQ = [];
  }

  addtoPQ(element) {
    // element is:  [node_id, cost, previous]
    this.arrPQ.push(element);
  }

  extractMin() {
    if (this.arrPQ.length === 0) throw new Error("The PQ is empty");
    let min = this.arrPQ[0][1]; // cost
    let minIndex = 0;
    this.arrPQ.forEach((element, index) => {
      if (element[1] < min) {
        min = element[1];
        minIndex = index;
      }
    });
    // remove it from arr, modify origianl arr, get 1st splised el out with [0]
    return this.arrPQ.splice(minIndex, 1)[0]; // [ 'C', 4, 'B' ]
  }

  updateElement(nodeId, cost, newPrevious) {
    // todo this can be moved away fron this DS. can be faster with obj
    this.arrPQ.forEach((element) => {
      if (element[0] === nodeId) {
        if (element[1] > cost) {
          element[1] = cost;
          element[2] = newPrevious;
        }
      }
    });
  }
  size() {
    return this.arrPQ.length;
  }
}

class Edge {
  // key is a node and the values are outgoing edges Edge(n=B, cost=6) ex: Edge.neighboorId
  constructor(neighboorId, cost) {
    this.neighboorId = neighboorId;
    this.cost = cost;
  }
}

class Graph {
  constructor() {
    this.graph = {};
  }

  addEdge(nodeA, nodeB, cost) {
    if (!this.graph[nodeA]) {
      this.graph[nodeA] = [];
    }
    if (!this.graph[nodeB]) {
      this.graph[nodeB] = [];
    }
    const edgeA = new Edge(nodeB, cost);
    this.graph[nodeA].push(edgeA);
    const edgeB = new Edge(nodeA, cost);
    this.graph[nodeB].push(edgeB);
    // console.log(this.graph);
  }

  getEdges(nodeId) {
    // return outgoing edges from the node
    return this.graph[nodeId];
  }

  getAllNodeIds() {
    return Object.keys(this.graph); // arr [ 'A', 'B', 'D', 'E', 'C' ]
  }
}

function dijkstra(startNodeId, graph, maxCost) {
  if (maxCost === undefined) {
    throw new Error("maxCost must be defined");
  }
  const myPQ = new PQ();
  // get all nodes from a graph: nodeid, cost, Previous
  const allNodes = graph.getAllNodeIds();
  // and iterate through them
  allNodes.forEach((nodeId) => {
    if (nodeId === startNodeId) {
      // myPQ.addtoPQ(["A", 0, null]);
      myPQ.addtoPQ([nodeId, 0, null]);
    } else {
      myPQ.addtoPQ([nodeId, Infinity, null]);
    }
  });
  // create a closed_list dict
  const closedList = {};
  while (myPQ.size() > 0) {
    // extract min
    const current = myPQ.extractMin();
    const [currentId, currentCost] = current;
    if (currentCost >= maxCost) {
      // optimization to stop early if all nodes are too far, we detected a stoping point
      return closedList;
    }
    // log which nodeId
    console.log(`Dijkstra is processing node currentId: ${currentId}`);
    // if cu_id in closedList
    if (currentId in closedList) {
      throw new Error("The item from a closedList is not allowed");
    }
    // need to go though edged, and forEach
    const edges = graph.getEdges(currentId);
    edges.forEach((edge) => {
      // Edge(neighboorId, cost)
      const totalCost = currentCost + edge.cost;
      myPQ.updateElement(edge.neighboorId, totalCost, currentId);
    });
    closedList[currentId] = current;
  }
  return closedList;
}

// to test: https://www.omnicalculator.com/other/latitude-longitude-distance
function estimateMinutesFromLatLon(lng1, lat1, lng2, lat2) {
  // assuming to Start the One walks no further than the Earth begins to curve, can use d for flat
  // (lng1, lat1) -> start/input,  (lng2, lat2) -> location of stations in the bounding start box;
  // d = distabce formula d = √((x2-x1)**2 + (y2-y1)**2)
  const distanceDegree = Math.sqrt((lng2 - lng1) ** 2 + (lat2 - lat1) ** 2);
  // 1deg=111km~69ml The length of one degree of latitude is approximately 69 miles (111 kilometers)
  const distanceKm = distanceDegree * 111;
  // console.log("distanceKm:", distanceKm);
  // walking ~4.5km/h~2.8 ml/h => 1h/4.5km * 60min/1h = 13.3min/km
  const minutes = distanceKm * (60 / 4.5);
  return minutes;
}

// ----------------- Math.PI----------------
// Convert the coordinates to radians and more are inside of test.js in root

module.exports = { dijkstra, Edge, estimateMinutesFromLatLon, Graph, PQ };
