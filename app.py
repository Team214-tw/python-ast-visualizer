from flask import Flask, request, send_from_directory
import ast
import json

app = Flask(__name__, static_url_path="", static_folder="build")

def classname(cls):
    return cls.__class__.__name__

def jsonify_ast(node, level=0):
    fields = {}
    for k in node._fields:
        fields[k] = '...'
        v = getattr(node, k)
        if isinstance(v, ast.AST):
            if v._fields: fields[k] = jsonify_ast(v)
            else:
                fields[k] = classname(v)

        elif isinstance(v, list):
            fields[k] = []
            for e in v:
                fields[k].append(jsonify_ast(e))

        elif isinstance(v, str) or isinstance(v, int) or isinstance(v, float):
            fields[k] = v

        elif v is None:
            fields[k] = None

        else:
            fields[k] = 'unrecognized'

    ret = { classname(node): fields }
    return ret

@app.route('/<path:path>')
def static_proxy(path):
    print(path)
    return send_from_directory('build', path)


@app.route('/api', methods=['POST'])
def ast2json():
    code = request.data
    tree = ast.parse(code)
    data = jsonify_ast(tree)
    return data


if __name__ == '__main__':
    app.run()
