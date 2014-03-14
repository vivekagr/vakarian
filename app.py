from werkzeug import serving
from flask import Flask, url_for, render_template
from jinja2 import Environment
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

# Inject HTML compression jinja2 plugin
# app.jinja_env.add_extension('jinja2htmlcompress.HTMLCompress')

# Disable the output of comments with this flag
app.jinja_env.globals['disable_comments'] = False


@app.route('/', defaults={'filename': 'index'})
@app.route('/<filename>.html')
def serve_file(filename):
    return render_template(filename + '.html')


if __name__ == '__main__':
    app.run('0.0.0.0', port=7779)
