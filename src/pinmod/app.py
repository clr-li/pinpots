# Runs the pytorch model on the input image and returns the output to the react app
from flask import Flask

# from model_setup import imagen

app = Flask(__name__)


@app.route("/")
def setup_model():
    return "Model setup complete"
