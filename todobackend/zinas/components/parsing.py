import os
import json
import random
import paho.mqtt.client as mqtt
import threading
import string


class Parse:

    def __init__(self):
        """
        Initalize variavbless
        """
        pass

    def input_data(self, data):
        """
        :param: data -- data coming from MQTT
        """

        columns = data.get("header").get("columns")
        data_ = data.get("data")
        data_ = data_[0].get("f")
        for key, val in data_.items():
            columns[key] = {**columns[key], **val}

        merged_data = columns

        return merged_data

