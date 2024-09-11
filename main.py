from flask import Flask, render_template, request, jsonify, make_response, redirect, url_for
from flask_cors import CORS
import os
import json
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Your secret from Replit environment variables
SECRET_KEY = os.environ['LICENCE']

tracked_websites = set()
target_file = os.path.join(app.static_folder, 'target.json')
blocked_file = os.path.join(app.static_folder, 'blocked.json')


@app.route('/')
def index():
    if not is_authenticated(request):
        return redirect('/static/login.html')
    return render_template('index.html')


@app.route('/track', methods=['POST'])
def track():
    data = request.json
    if 'visitedUrl' in data:
        tracked_websites.add(data['visitedUrl'])
    print(f"Tracked websites updated: {list(tracked_websites)}")
    return jsonify({"status": "success"}), 200


@app.route('/getTrackedWebsites', methods=['GET'])
def get_tracked_websites():
    print(f"Returning tracked websites: {list(tracked_websites)}")
    return jsonify(list(tracked_websites))


@app.route('/addTarget', methods=['POST'])
def add_target():
    url = request.json.get('url')
    if url:
        if os.path.exists(target_file):
            with open(target_file, 'r') as file:
                targets = json.load(file)
        else:
            targets = []

        if url not in targets:
            targets.append(url)
            with open(target_file, 'w') as file:
                json.dump(targets, file, indent=4)

    return jsonify({"status": "success"}), 200


@app.route('/getTargets', methods=['GET'])
def get_targets():
    if not os.path.exists(target_file):
        return jsonify([])
    with open(target_file, 'r') as file:
        targets = json.load(file)
    return jsonify(targets)


@app.route('/addBlock', methods=['POST'])
def add_block():
    url = request.json.get('url')
    if url:
        if os.path.exists(blocked_file):
            with open(blocked_file, 'r') as file:
                blocks = json.load(file)
        else:
            blocks = []

        if url not in blocks:
            blocks.append(url)
            with open(blocked_file, 'w') as file:
                json.dump(blocks, file, indent=4)

    return jsonify({"status": "success"}), 200


@app.route('/getBlockedUrls', methods=['GET'])
def get_blocked_urls():
    if not os.path.exists(blocked_file):
        return jsonify([])
    with open(blocked_file, 'r') as file:
        blocks = json.load(file)
    return jsonify(blocks)


@app.route('/validate-key', methods=['POST'])
def validate_key():
    data = request.json
    key = data.get('key')
    if key == SECRET_KEY:
        resp = make_response(jsonify({"success": True}))
        expires = datetime.utcnow() + timedelta(minutes=5)
        resp.set_cookie('auth', 'true', expires=expires)
        return resp
    else:
        return jsonify({"success": False})


def is_authenticated(request):
    return request.cookies.get('auth') == 'true'


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
