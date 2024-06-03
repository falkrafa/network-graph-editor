from flask import Flask, request, jsonify
from flask_cors import CORS
import networkx as nx
import utils

app = Flask(__name__)
CORS(app)

graph = utils.create_graph()

@app.route('/set_graph_type', methods=['POST'])
def set_graph_type():
    global graph
    data = request.json
    graph = utils.create_graph(data.get('directed'))
    return jsonify({'message': f'Graph type set to {"directed" if data.get("directed") else "undirected"}'}), 200

@app.route('/add_vertex', methods=['POST'])
def add_vertex():
    data = request.json
    utils.add_vertex(graph, data.get('vertex'))
    return jsonify({'message': 'Vertex added'}), 200

@app.route('/add_edge', methods=['POST'])
def add_edge():
    data = request.json
    utils.add_edge(graph, data.get('u'), data.get('v'), data.get('weight'))
    return jsonify({'message': 'Edge added'}), 200

@app.route('/graph_data', methods=['GET'])
def graph_data():
    nodes, edges, order, size = utils.get_graph_data(graph)
    return jsonify({'nodes': nodes, 'edges': edges, 'order': order, 'size': size}), 200

@app.route('/clear_graph', methods=['POST'])
def clear_graph():
    utils.clear_graph(graph)
    return jsonify({'message': 'Graph cleared'}), 200

@app.route('/remove_vertex', methods=['POST'])
def remove_vertex():
    data = request.json
    utils.remove_vertex(graph, data.get('vertex'))
    return jsonify({'message': 'Vertex removed'}), 200

@app.route('/remove_edge', methods=['POST'])
def remove_edge():
    data = request.json
    utils.remove_edge(graph, data.get('u'), data.get('v'), int(data.get('weight')))
    return jsonify({'message': 'Edge removed'}), 200

@app.route('/get_neighbors', methods=['POST'])
def get_neighbors():
    data = request.json
    response = utils.get_neighbours_data(data, graph)
    return jsonify(response), 200

@app.route('/get_check_if_adjacents', methods=['POST'])
def get_check_if_adjacents():
    data = request.json
    u, v = data.get('u'), data.get('v')
    if utils.check_if_adjacent(graph, u, v):
        return jsonify({'message': 'Vertices are adjacent'}), 200
    else:
        return jsonify({'message': 'Vertices are not adjacent'}), 200

@app.route('/get_degree', methods=['POST'])
def get_degree():
    data = request.json
    response = utils.get_degree_data(data, graph)
    return jsonify(response), 200

@app.route('/shortest_path', methods=['POST'])
def shortest_path():
    data = request.json
    source, target = data.get('source'), data.get('target')
    path, length = utils.shortest_path(graph, source, target)
    if path is not None:
        return jsonify({'path': path, 'length': length}), 200
    else:
        return jsonify({'message': 'No path exists between the provided vertices'}), 404

@app.route('/upload_batch-graph', methods=['POST'])
def upload_batch_graph():
    data = request.json
    utils.upload_batch_graph(graph, data.get('nodes'), data['edges'])
    return jsonify({'message': 'Graph uploaded successfully'}), 200

@app.route('/is_eulerian', methods=['GET'])
def is_eulerian():
    if utils.is_eulerian(graph):
        return jsonify({'message': 'Graph is Eulerian'}), 200
    else:
        return jsonify({'message': 'Graph is not Eulerian'}), 200
    
@app.route('/is_semi_eulerian', methods=['GET'])
def is_semi_eulerian():
    if utils.is_semi_eulerian(graph):
        return jsonify({'message': 'Graph is Semi-Eulerian'}), 200
    else:
        return jsonify({'message': 'Graph is not Semi-Eulerian'}), 200

if __name__ == '__main__':
    app.run(debug=True)
