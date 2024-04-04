export interface Polygon {
  vertices: Vertice[];
  edges: Edge[];
}

interface Edge {
  x: number;
  y: number;
}

interface Vertice {
  x: number;
  y: number;
}

export function createPolygon(vertices: Vertice[]) {
  const polygon = {} as Polygon;
  polygon.vertices = vertices;
  polygon.edges = buildEdges(vertices);

  return polygon;
}

function projectInAxis(polygon, x, y) {
  let min = 10000000000;
  let max = -10000000000;
  for (let i = 0; i < polygon.vertices.length; i++) {
    const px = polygon.vertices[i].x;
    const py = polygon.vertices[i].y;
    const projection = (px * x + py * y) / Math.sqrt(x * x + y * y);
    if (projection > max) {
      max = projection;
    }
    if (projection < min) {
      min = projection;
    }
  }
  return { min, max };
}

export function testForCollision(polygon, otherPolygon) {
  const edges = [];
  for (let i = 0; i < polygon.edges.length; i++) {
    edges.push(polygon.edges[i]);
  }
  for (let i = 0; i < otherPolygon.edges.length; i++) {
    edges.push(otherPolygon.edges[i]);
  }
  // build all axis and project
  for (let i = 0; i < edges.length; i++) {
    // get axis
    const length = Math.sqrt(edges[i].y * edges[i].y + edges[i].x * edges[i].x);
    const axis = {
      x: -edges[i].y / length,
      y: edges[i].x / length,
    };
    // project polygon under axis
    const { min: minA, max: maxA } = projectInAxis(polygon, axis.x, axis.y);
    const { min: minB, max: maxB } = projectInAxis(otherPolygon, axis.x, axis.y);
    if (intervalDistance(minA, maxA, minB, maxB) > 0) {
      return false;
    }
  }
  return true;
}

function buildEdges(vertices: Vertice[]) {
  const edges = [];
  if (vertices.length < 3) {
    console.error('Only polygons supported.');
    return edges;
  }
  for (let i = 0; i < vertices.length; i++) {
    const a = vertices[i];
    let b = vertices[0];
    if (i + 1 < vertices.length) {
      b = vertices[i + 1];
    }
    edges.push({
      x: b.x - a.x,
      y: b.y - a.y,
    });
  }
  return edges;
}

function intervalDistance(minA: number, maxA: number, minB: number, maxB: number) {
  if (minA < minB) {
    return minB - maxA;
  }
  return minA - maxB;
}
