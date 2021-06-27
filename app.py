from flask import Flask, render_template, request, make_response, send_from_directory
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

app = Flask(__name__)

dic = {0 : 'Astrophytum', 1 : 'Schlumbergera'}

model = load_model('model.h5')

model.make_predict_function()

def predict_label(img_path):
	i = image.load_img(img_path, target_size=(100,100))
	i = image.img_to_array(i)/255.0
	i = i.reshape(1, 100,100,3)
	p = model.predict_classes(i)
	return dic[p[0]]


# routes
@app.route("/", methods=['GET', 'POST'])
def main():
	return render_template("index.html")

@app.route("/about")
def about_page():
	return "Please subscribe  Artificial Intelligence Hub..!!!"

@app.route("/submit", methods = ['GET', 'POST'])
def get_output():
	if request.method == 'POST':
		img = request.files['my_image']

		img_path = "static/" + img.filename	
		img.save(img_path)

		p = predict_label(img_path)

	return render_template("index.html", prediction = p, img_path = img_path)

# @app.route('/service-worker.js')
# def sw():
#     return app.send_static_file('service-worker.js'), 200, {'Content-Type': 'text/javascript'}

if __name__ =='__main__':
	#app.debug = True
	app.run(debug = True)