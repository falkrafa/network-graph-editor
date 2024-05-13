import networkx as nx

def create_graph(directed=False):
    if directed:
        return nx.MultiDiGraph()
    else:
        return nx.MultiGraph()

def add_vertex(graph, vertex):
    graph.add_node(vertex)

def add_edge(graph, u, v, weight=None):
    graph.add_edge(u, v, key=weight, weight=weight)

def clear_graph(graph):
    graph.clear()

def remove_vertex(graph, vertex):
    if vertex in graph:
        graph.remove_node(vertex)

def remove_edge(graph, u, v, weight=None):
    if graph.has_edge(u, v):
        graph.remove_edge(u, v, key=weight)

def get_neighbors(graph, vertex):
    if vertex in graph:
        neighbors = list(graph.neighbors(vertex))
        if isinstance(graph, nx.DiGraph) or isinstance(graph, nx.MultiDiGraph):
            in_neighbors = [pred for pred in graph.predecessors(vertex)]
            out_neighbors = [succ for succ in graph.successors(vertex)]
            return neighbors, in_neighbors, out_neighbors
        else:
            return neighbors, None, None
    else:
        return None, None, None

def check_if_adjacent(graph, u, v):
    return graph.has_edge(u, v)

def get_degree(graph, vertex):
    if vertex in graph:
        degree = graph.degree(vertex)
        if isinstance(graph, nx.DiGraph) or isinstance(graph, nx.MultiDiGraph):
            in_degree = graph.in_degree(vertex)
            out_degree = graph.out_degree(vertex)
            return degree, in_degree, out_degree
        else:
            return degree, None, None
    else:
        return None, None, None

def shortest_path(graph, source, target):
    if source in graph and target in graph:
        try:
            path = nx.dijkstra_path(graph, source, target, weight='weight')
            length = nx.dijkstra_path_length(graph, source, target, weight='weight')
            return path, length
        except nx.NetworkXNoPath:
            return None, None
    else:
        return None, None

def upload_batch_graph(graph, nodes, edges):
    for node in nodes:
        graph.add_node(node['id']) 
    for edge in edges:
        graph.add_edge(edge['source'], edge['target'], key=edge['weight'], weight=edge['weight'])

def get_graph_data(graph):
    nodes = [{'id': node} for node in graph.nodes()]
    edges = [{'u': u, 'v': v, 'weight': d.get('weight', None), 'key': key} for u, v, key, d in graph.edges(keys=True, data=True)]
    order = len(graph.nodes())
    size = len(graph.edges())
    return (nodes, edges, order, size)

def get_degree_data(data, graph):
    vertex = data.get('vertex')
    degree, in_degree, out_degree = get_degree(graph, vertex)
    response_data = {'degree': degree}
    if in_degree is not None:
        response_data['in_degree'] = in_degree
        response_data['out_degree'] = out_degree

    return response_data

def get_neighbours_data(data, graph):
    vertex = data.get("vertex")
    neighbors, in_neighbors, out_neighbors = get_neighbors(graph, vertex)
    response_data = {'neighbors': neighbors}
    if in_neighbors is not None:
        response_data['in_neighbors'] = in_neighbors
        response_data['out_neighbors'] = out_neighbors

    return response_data