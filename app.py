from werkzeug import serving
from flask import Flask, url_for, render_template
import config


# Hiding the file request logs
def log_request(self, code='-', size='-'):
    pass

serving.WSGIRequestHandler.log_request = log_request


app = Flask(__name__, static_url_path='/assets')
app.config.from_object(config)

app.jinja_env.globals['static'] = lambda filename: url_for('static', filename=filename)
app.jinja_env.trim_blocks = True
app.jinja_env.lstrip_blocks = True


@app.route('/', defaults={'filename': 'index'})
@app.route('/<filename>.html')
def serve_file(filename):
    return render_template(filename + '.html')


if __name__ == '__main__':
    app.run('0.0.0.0', port=7779)
