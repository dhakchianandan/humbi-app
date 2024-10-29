from flask import Flask, render_template, request
import os
import pandas as pd
import pandasai
from pandasai import SmartDatalake
from flask_cors import CORS

# import openai

app = Flask(__name__)
CORS(app)


# os.environ["OPENAI_API_KEY"] = "sk-.."
# openai.api_key = os.environ["OPENAI_API_KEY"]

employees_data = {
    'EmployeeID': [1, 2, 3, 4, 5],
    'Name': ['John', 'Emma', 'Liam', 'Olivia', 'William'],
    'Department': ['HR', 'Sales', 'IT', 'Marketing', 'Finance']
}

salaries_data = {
    'EmployeeID': [1, 2, 3, 4, 5],
    'Salary': [5000, 6000, 4500, 7000, 55400]
}


employees_df = pd.DataFrame(employees_data)
salaries_df = pd.DataFrame(salaries_data)

# By default, unless you choose a different LLM, it will use BambooLLM.
# You can get your free API key signing up at https://pandabi.ai (you can also configure it in your .env file)
os.environ["PANDASAI_API_KEY"] = "$2a$10$O8Genp9/P./8XZhkLJwB.eTOuvmdoMsj/y4cVCdmJcNDDYVd.EhDG"

lake = SmartDatalake([employees_df, salaries_df])
# response = lake.chat("Who gets paid the most?")
# print(response)
# Output: Olivia gets paid the most

@app.route("/get")
def get_bot_response():
    userText = request.args.get('msg')
    print("userText : " + userText)
    response = lake.chat(userText)
    print("response : " + response)
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5020)  # This allows access from all interfaces
