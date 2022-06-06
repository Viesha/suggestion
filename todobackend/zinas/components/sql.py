import os
import traceback
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from pytz import timezone
import pytz
import time
import logging


class SQL:
    """
    SQL codes class
    """

    def __init__(self):
        """
        Constructor to set up DB configuration
        """
        try:
            self.connection = psycopg2.connect(
                user="andris",
                password="BUMBURS1978",
                host="192.168.88.240",
                port=5432,
                database="todoapp")
            self.cursor = self.connection.cursor(cursor_factory=RealDictCursor)  # converting  sql data to json data
  
            self.zone = timezone('Europe/Riga')

        except Exception as e:
            traceback.print_exc()
            print(e)
            raise e

  

    def insert_to_telemdata(self, val, ts, dp_id):
        """
        @params val value, ts timestamp
        Inserting data to telemdata table
        """

        try:
            ts = datetime.fromtimestamp(ts, tz=self.zone)  # converting timezone to riga timezone

            query = """INSERT INTO  test_data(dp,val,ts) VALUES(%s,%s,%s)"""

            self.cursor.execute(query, (dp_id, val, ts))
            self.connection.commit()
            print("inserted")

        except Exception as e:
            err = traceback.format_exc()
            print(err)

    def close_connection(self):
        """
        :params: None
        Connection closing by calling this function
        """
        if self.connection:
            self.cursor.close()
            self.connection.close()
            print("PostgreSQL connection is closed")
