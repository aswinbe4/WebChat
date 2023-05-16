from flask import Flask, render_template, request, jsonify
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.text_rank import TextRankSummarizer
import nltk
nltk.download('punkt')

app = Flask(__name__)

# Storing messages in memory (replace with a database in a production app)
messages = []

def summarize_text(text, num_sentences=3):
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = TextRankSummarizer()
    summary = summarizer(parser.document, num_sentences)
    summarized_text = [str(sentence) for sentence in summary]
    return " ".join(summarized_text)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send_message', methods=['POST'])
def send_message():
    message = request.form['message']
    username = request.form['username']
    if username.strip() != '' and message.strip() != '':
        summarized_message = summarize_text(message)
        messages.append({'username': username, 'message': summarized_message})
    return jsonify({'success': True})

@app.route('/get_messages', methods=['GET'])
def get_messages():
    summarized_messages = [{'username': message['username'], 'message': summarize_text(message['message'])} for message in messages]
    return jsonify({'messages': summarized_messages})

if __name__ == '__main__':
    app.run(debug=True)
