from werkzeug import serving
from werkzeug.contrib.fixers import ProxyFix
from flask import Flask, url_for, render_template, send_file
from jinja2 import Environment

from nav import nav_menu
from data import glyphicons
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

# Enabling `do` extension to mitigate scoping issues
# Was unable to access `active` variable inside nested for and if blocks in sidebar nav
# http://stackoverflow.com/questions/17925674
app.jinja_env.add_extension('jinja2.ext.do')


app.jinja_env.globals['nav_menu'] = nav_menu


@app.route('/', defaults={'filename': 'index'})
@app.route('/<filename>.html')
def serve_file(filename):

    context_dict = {
        'template': filename + '.html',
    }

    if filename == 'icons':
        context_dict['glyphicons'] = glyphicons

    return render_template(filename + '.html', **context_dict)


@app.route('/favicon.ico')
def favicon():
    return send_file('templates/favicon.ico')


app.wsgi_app = ProxyFix(app.wsgi_app)

if __name__ == '__main__':
    app.run('0.0.0.0', port=7779)
