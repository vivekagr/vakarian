from flask import Flask, url_for, render_template
from werkzeug import serving


# Hiding the file request logs
def log_request(self, code='-', size='-'):
    pass

serving.WSGIRequestHandler.log_request = log_request


app = Flask(__name__, static_url_path='/assets')

app.jinja_env.globals['s'] = lambda filename: url_for('static', filename=filename)


@app.route('/', defaults={'filename': 'index'})
@app.route('/<filename>.html')
def serve_file(filename):
    return render_template(filename + '.html')


if __name__ == '__main__':
    app.run('0.0.0.0', port=7779, debug=True)
