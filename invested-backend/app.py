from flask import Flask

app = Flask(__name__)

@app.route('/')
def default():
    return {'caption': "hello, world!"}