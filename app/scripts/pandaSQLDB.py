from flask import Flask, render_template, request
import os
import pandas as pd
import pandasai
from pandasai import Agent
# import openai
from sqlalchemy import create_engine

app = Flask(__name__)

# Setting up database connection using SQLAlchemy
DB_TYPE = 'mysql'  # or 'postgresql', 'sqlite', etc.
DB_DRIVER = 'pymysql'  # or 'psycopg2', depending on your database
USERNAME = 'your_username'
PASSWORD = 'your_password'
HOST = 'your_database_host'
PORT = 'your_database_port'  # default for MySQL is 3306, for PostgreSQL is 5432
DATABASE = 'your_database_name'

# Create the database connection URL
connection_string = f"{DB_TYPE}+{DB_DRIVER}://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}"
dbEngine = create_engine(connection_string)

# Fetch all table names
with dbEngine.connect() as connection:
    tables = connection.execute("SHOW TABLES;").fetchall()  # Use "SELECT table_name FROM information_schema.tables" for other databases

# Fetch data from each table
dataframes = {}
for table in tables:
    table_name = table[0]
    query = f"SELECT * FROM {table_name};"
    dataframes[table_name] = pd.read_sql(query, dbEngine)

# Now you have a dictionary of DataFrames with table names as keys

pandaAgent = Agent(dataframes.values)


# By default, unless you choose a different LLM, it will use BambooLLM.
# You can get your free API key signing up at https://pandabi.ai (you can also configure it in your .env file)
os.environ["PANDASAI_API_KEY"] = "$2a$10$O8Genp9/P./8XZhkLJwB.eTOuvmdoMsj/y4cVCdmJcNDDYVd.EhDG"


@app.route("/get")
def get_bot_response():
    userText = request.args.get('msg')
    pandaAgent.chat(userText)

    print(userText)
    keys = response_df.keys()
    output = 'According to me, the '
    arr_output = []
    for key in keys:
        if len(response_df[key].values) > 1:
            values = []
            for value in response_df[key].values:
                values.append(str(value))
            values_str = ', '.join(values)
            arr_output.append(f'the number of {key} is {len(values)} and they are {values_str}')
        else:
            values = response_df[key].values[0]
            arr_output.append(f'{key} is {values}')

    arr_ = ' and '.join(arr_output)
    output += arr_
    output.strip()
    return output