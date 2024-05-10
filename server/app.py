from flask import Flask, request, jsonify
from flask_cors import CORS
import networkx as nx
from networkx.algorithms.shortest_paths.weighted import dijkstra_path, dijkstra_path_length

app = Flask(__name__)
CORS(app)

graph = nx.Graph() 

@app.route('/set_graph_type', methods=['POST'])
def set_graph_type():
    global graph
    data = request.json
    if data['directed']:
        graph = nx.MultiDiGraph()
    else:
        graph = nx.MultiGraph()
    return jsonify({'message': 'Graph type set to directed' if data['directed'] else 'Graph type set to undirected'}), 200


@app.route('/add_vertex', methods=['POST'])
def add_vertex():
  data = request.json
  graph.add_node(data['vertex'])
  return jsonify({'message': 'Vertex added'}), 200

@app.route('/add_edge', methods=['POST'])
def add_edge():
  data = request.json
  graph.add_edge(data['u'], data['v'], weight=data.get('weight'))
  return jsonify({'message': 'Edge added'}), 200

@app.route('/graph_data', methods=['GET'])
def graph_data():
  nodes = [{'id': node} for node in graph.nodes()]
  edges = [{'u': u, 'v': v, 'weight': d.get('weight', None), 'key': key} for u, v, key, d in graph.edges(keys=True, data=True)]
  order = len(graph.nodes())
  size = len(graph.edges())
  return jsonify({'nodes': nodes, 'edges': edges, 'order': order, 'size': size}), 200


@app.route('/clear_graph', methods=['POST'])
def clear_graph():
    global graph
    graph.clear()
    return jsonify({'message': 'Graph cleared'}), 200

@app.route('/remove_vertex', methods=['POST'])
def remove_vertex():
    data = request.json
    if data['vertex'] in graph:
        graph.remove_node(data['vertex'])
        return jsonify({'message': 'Vertex removed'}), 200
    return jsonify({'message': 'Vertex not found'}), 404

@app.route('/remove_edge', methods=['POST'])
def remove_edge():
    data = request.json
    if graph.has_edge(data['u'], data['v']):
        graph.remove_edge(data['u'], data['v'])
        return jsonify({'message': 'Edge removed'}), 200
    return jsonify({'message': 'Edge not found'}), 404

@app.route('/get_neighbors', methods=['POST'])
def get_neighbors():
    data = request.json
    vertex = data['vertex']
    if vertex not in graph:
        return jsonify({'message': 'Vertex not found'}), 404

    neighbors = list(graph.neighbors(vertex))
    if isinstance(graph, nx.DiGraph) or isinstance(graph, nx.MultiDiGraph):
        in_neighbors = [pred for pred in graph.predecessors(vertex)]
        out_neighbors = [succ for succ in graph.successors(vertex)]
        return jsonify({'neighbors': neighbors, 'in_neighbors': in_neighbors, 'out_neighbors': out_neighbors}), 200
    else:
        return jsonify({'neighbors': neighbors}), 200

@app.route('/get_check_if_adjacents', methods=['POST'])
def get_check_if_adjacents():
    data = request.json
    u = data['u']
    v = data['v']

    if graph.has_edge(u, v):
        return jsonify({'message': 'Vertices are adjacent'}), 200
    else:
        return jsonify({'message': 'Vertices are not adjacent'}), 200
    
@app.route('/get_degree', methods=['POST'])
def get_degree():
    data = request.json
    vertex = data['vertex']
    if vertex not in graph:
        return jsonify({'message': 'Vertex not found'}), 404

    degree = graph.degree(vertex)
    if isinstance(graph, nx.DiGraph) or isinstance(graph, nx.MultiDiGraph):
        in_degree = graph.in_degree(vertex)
        out_degree = graph.out_degree(vertex)
        print(in_degree, out_degree)
        return jsonify({'degree': degree, 'in_degree': in_degree, 'out_degree': out_degree}), 200
    else:
        return jsonify({'degree': degree}), 200

@app.route('/shortest_path', methods=['POST'])
def shortest_path():
    data = request.json
    source = data['source']
    target = data['target']
    
    if source not in graph or target not in graph:
        return jsonify({'message': 'Both vertices must exist in the graph'}), 404

    try:
        path = dijkstra_path(graph, source, target, weight='weight')
        length = dijkstra_path_length(graph, source, target, weight='weight')
        return jsonify({'path': path, 'length': length}), 200
    except nx.NetworkXNoPath:
        return jsonify({'message': 'No path exists between the provided vertices'}), 404
    
@app.route('/upload_batch-graph', methods=['POST'])
def upload_batch_graph():
    data = request.json
    for vertex in data['nodes']:
        graph.add_node(vertex['id']) 
    for edge in data['edges']:
        graph.add_edge(edge['source'], edge['target'], weight=edge['weight'])
    return jsonify({'message': 'Graph uploaded successfully'}), 200


if __name__ == '__main__':
  app.run(debug=True)
