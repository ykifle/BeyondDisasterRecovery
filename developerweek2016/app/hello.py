import os
import flask
from flask import Flask
from flask.ext.cors import CORS
import subprocess
import time
import re
import random

app = Flask(__name__)
CORS(app)

EAST_HOST = 'ec2-user@ec2-52-72-154-92.compute-1.amazonaws.com'
WEST_HOST = 'ec2-user@ec2-52-25-12-43.us-west-2.compute.amazonaws.com'

@app.route("/")
def hello():
  return "Hello world!"

@app.route("/graphdata")
def graphdata():
  data = {
    'data': [int(20*random.random()) for i in xrange(10)]
  }
  return flask.jsonify(**data)

@app.route("/mapdata")
def mapdata():
  data = { "count": 2,
   "nodes": [
      {
        "name": "US-West",
        "longitude": -122.431297,
        "latitude": 37.7833,
        "id": 1,
        "master": True
      },
      {
        "name": "US-East",
        "longitude": -73.138260,
        "latitude": 40.792240,
        "id": 2,
        "master": False
      }
  ]};
  return flask.jsonify(**data)

def sshcmd(host, cmd):
  com = "/usr/bin/ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no {} '{}'".format(host, cmd)
  return subprocess.Popen(com, shell=True, stdout=subprocess.PIPE).stdout.read().decode("utf-8")

@app.route("/cmd")
def runcommand():
  return sshcmd(EAST_HOST, 'ls')

@app.route("/status")
def runcheck():
  east_result = sshcmd(EAST_HOST, 'sh check.sh')
  west_result = sshcmd(WEST_HOST, 'sh check.sh')
  east_is_master = 'This table is currently empty' in east_result
  west_is_master = not east_is_master
  east_data = re.sub(r"\s+", ' ', [l for l in east_result.split("\n") if re.search('dest\s', l)][0]).strip().split(' ')
  west_data = re.sub(r"\s+", ' ', [l for l in west_result.split("\n") if re.search('src\s', l)][0]).strip().split(' ')
  east_size = float(east_data[5].replace('GB', ''))
  east_available = east_size = float(east_data[6].replace('GB', ''))
  east_used = east_size = float(east_data[7].replace('%', ''))
  west_size = float(west_data[5].replace('GB', ''))
  west_available = west_size = float(west_data[6].replace('GB', ''))
  west_used = west_size = float(west_data[7].replace('%', ''))
  if east_is_master:
    snap_data = re.sub(r"\s+", ' ', west_result.split("\n")[-3]).strip().split(' ')
  else:
    snap_data = re.sub(r"\s+", ' ', east_result.split("\n")[-3]).strip().split(' ')

  source_path = snap_data[0]
  destination_path = snap_data[2]
  mirror_state = snap_data[3]
  relationship_status = snap_data[4]
  health_check = snap_data[6]

  data = {
    "output": "{}\n{}".format(east_result, west_result),
    "source_path": source_path,
    "destination_path": destination_path,
    "mirror_state": mirror_state,
    "relationship_status": relationship_status,
    "health_check": health_check,
    "nodes": [
      {
        "name": "US-East",
        "longitude": -73.138260,
        "latitude": 40.792240,
        "master": east_is_master,
        "size": east_size,
        "size_str": east_data[5],
        "available": east_available,
        "available_str": east_data[6],
        "used": east_used,
        "used_str": east_data[7]
      },
      {
        "name": "US-West",
        "longitude": -122.431297,
        "latitude": 37.7833,
        "master": west_is_master,
        "size": west_size,
        "size_str": west_data[5],
        "available": west_available,
        "available_str": west_data[6],
        "used": west_used,
        "used_str": west_data[7]
      }
    ]
  }

  return flask.jsonify(**data)

@app.route("/eastmaster")
def eastmaster():
  result1 = sshcmd(EAST_HOST, 'sh switch1.sh')
  time.sleep(2)
  result2 = sshcmd(WEST_HOST, 'sh switch1.sh')
  data = {
    "output": "{}\n{}".format(result1, result2),
  }
  return flask.jsonify(**data)

@app.route("/westmaster")
def westmaster():
  result1 = sshcmd(WEST_HOST, 'sh switch2.sh')
  time.sleep(2)
  result2 = sshcmd(EAST_HOST, 'sh switch2.sh')
  data = {
    "output": "{}\n{}".format(result1, result2),
  }
  return flask.jsonify(**data)

if __name__ == "__main__":
  port = int(os.environ.get("PORT", 5000))
  app.run(host='0.0.0.0', port=port)