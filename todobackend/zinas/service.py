import os
import json
import random
import paho.mqtt.client as mqtt
import threading
import string
from components.parsing import Parse
from components.sql import SQL
import traceback
from pytz import timezone
from datetime import datetime
import pytz
import time
import logging

riga = timezone('Europe/Riga')


class Subscribe:

    def __init__(self, username, passowrd, topic, host, port):
        """
        Initalize variavbless
        """
        self.username = username
        self.password = passowrd
        self.topic = topic
        self.host = host
        self.sql = SQL()
        self.port = port
        self.conf_json = {
            "Idnr":1,
            "Fabnr":2,
            "Volume": "3",
            "Vert1": "4",
            "Vert2": "5",
            "Vert3": "6",
            "Vert4": "7",
            "Vert5": "8",
            "Vert6": "9",
            "Vert7": "10",
            "Vert8": "11",
        }
        self.parsing = Parse()

    def start(self):
        letters = string.ascii_letters
        rand_str = ''.join(random.choice(letters) for i in range(4))

        self.mqttc = mqtt.Client(client_id="Python" + rand_str)
        self.connected = False
        self.mqtt_message = ""
        self.mqttc.username_pw_set(self.username, self.password)
        self.mqttc.on_connect = self.on_connect
        self.mqttc.on_message = self.on_message
        self.mqttc.connect(self.host, self.port)
        self.mqttc.loop_forever()

    def on_message(self, client, userdata, message):
        """
        Fetch data when data coming to Broker
        """
        topic = message.topic
        self.mqtt_message = json.loads(message.payload.decode("utf-8"))
        merged_data = self.parsing.input_data(self.mqtt_message)

        self.insert_to_telem_data(merged_data)

    def insert_to_telem_data(self, merged_data):
        """:params: merged_data - is parsed data from MQTT"""
        dt = datetime.now()
        ts = int(datetime.timestamp(dt))
       
        print(merged_data)
        for key, val in merged_data.items():
            
            if self.conf_json.get(val.get("name")):

                print(val.get("v"), ts, self.conf_json.get(val.get("name")))

                self.sql.insert_to_telemdata(val.get("v"), ts, self.conf_json.get(val.get("name")))

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print("Connected to broker", self.topic)
            self.mqttc.subscribe(self.topic)
            self.connected = True

        else:
            print("could not connect", self.topic)

    def get_mqtt_mesage(self):
        return self.mqtt_message


if __name__ == '__main__':
    threads = []

    t1 = threading.Thread(target=Subscribe('Plavu8', "Andris", "test_dati", "192.168.88.240", 1883).start)

    threads.append(t1)

    for thread in threads:
        thread.start()

    for thread in threads:
        thread.join()
