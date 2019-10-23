from flask import Flask, render_template, request, send_from_directory
import json
from prologInterface import solutionOf, casos
app = Flask(__name__)

@app.route('/')
def index():
	return render_template("base.html")

@app.route('/response', methods=['GET', 'POST'])
def response():
	try:
		for i in request.form:
			casoDict = json.loads(i)
	except Exception as e:
		print(f"EXCEÇÂO: {e}")

	return json.dumps(solutionOf(casoDict))

if __name__ == '__main__':
	app.run(debug=True)