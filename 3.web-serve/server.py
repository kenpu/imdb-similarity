from flask import Flask, render_template, jsonify
import imdb
from time import time

app = Flask(__name__)

@app.route("/")
def index_page():
    return render_template("index.html")

@app.route("/api/similarity/<attribute>/")
def api_similarity(attribute):
    start   = time()
    sim     = None
    size    = None
    err     = None

    try:
        sim, size = imdb.get_similarity(attribute)
        sim = sorted([[x[0], x[1], y] for x,y in sim.items()], 
                key=lambda t: t[2], reverse=1)
    except Exception, e:
        err = str(e)

    duration = time() - start
    return jsonify(sim=sim, size=size, err=err, duration=duration)

if __name__ == '__main__':
    app.run(debug=True, port = 10400, host="0.0.0.0")


