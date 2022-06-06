from numpy import NaN
import psycopg2
from sqlalchemy import create_engine
from sqlalchemy import inspect
import time
from datetime import datetime, timedelta
from datetime import date
from sqlalchemy import MetaData
from sqlalchemy import Table
import pandas as pd

metadata = MetaData()


try:
    conn = psycopg2.connect(host="192.168.88.240",database="todoapp", user="andris", password="BUMBURS1978", port=5432)	
except:
    print ('I am unable to connect to the database')

cur = conn.cursor()
df=pd.DataFrame()

try:
    EL1=pd.read_sql_query('SELECT * FROM test_data', conn)
except:
     conn.rollback()
     EL1=pd.read_sql_query("SELECT * from test_data", conn)

dff = pd.DataFrame(EL1, columns = ['id', 'val','ts','dp'])
dff['Datetime'] = pd.to_datetime(dff['ts'])
dff['Datetime']=dff['Datetime']+pd.DateOffset(hours=3)
Pat=pd.DataFrame()

Pat = dff.loc[(dff['dp'] == 11), ['id', 'val', 'ts', 'dp','Datetime']] # piesaista Pateriņa db pie jauna dataframe 
PatDiena=Pat.resample('24H', on='Datetime').max() #iegūst katras dienas max paterinu
PatDiena['El paterins']=PatDiena['val'].diff()    #iegust katras dienas veikto paterinu
print(PatDiena['El paterins'])
NedelasVidejais = (PatDiena['El paterins'].sum()/len(PatDiena.index)) # aprēķīna dienas vidējo patēriņu.
Atskaite1=Pat.resample('1H', on='Datetime').max() #iegūst katras h max paterinu
Atskaite1['El paterins']=Atskaite1['val'].diff()  #iegust katras h veikto paterinu

# --- pedējās stundas patēriņš + teksts ---
last_value = Atskaite1['El paterins'].iat[-1]
last_value=round(last_value,2) 
if(last_value>=0.9):
    dati_apr='Pēdējās h elektrības pateriņš ir ļoti augsts ( '+ str(last_value) + ' kWh).'
elif(last_value>=0.72):
    dati_apr='Pēdējās h elektrības pateriņš ir augsts ( '+ str(last_value) + ' kWh).'
elif(last_value>=0.54):
    dati_apr='Pēdējās h elektrības pateriņš ir normas robežās ( '+ str(last_value) + ' kWh).'
elif(last_value>=0.36):
    dati_apr='Pēdējās h elektrības pateriņš ir zem normas ( '+ str(last_value) + ' kWh).'
elif(last_value>=0.18):
    dati_apr='Pēdējās h elektrības pateriņš ir zems ( '+ str(last_value) + ' kWh).'
else:dati_apr='Pēdējās h elektrības pateriņš ir ļoti zems ( '+ str(last_value) + ' kWh).'
# ---------------------------------------


NedDif=(PatDiena['El paterins'].iat[-2]/NedelasVidejais)*100-100 # % atsķirība starp iepriekšējās dienas patēriņu, un vidējo patēriņu.

# ---       --    Teksta izveide         -- ---
dati_apr = dati_apr + " Pēdējās dienas patēriņš ir " + str(round(PatDiena['El paterins'].iat[-2],2))+ " kWh, " 
if NedelasVidejais > 0:
    dati_apr = dati_apr + "tas ir par "+str(round(NedDif,2))+"% vairāk par vidējo patēriņu ( "
else:
    dati_apr = dati_apr + "tas ir par "+str(round(NedDif,2))+"% mazāk par vidējo patēriņu ( "

dati_apr = dati_apr + str(round(NedelasVidejais,2)) + " kWh)"

print(dati_apr)
now = datetime.utcnow() # UTC - db bus ar +3
current_time = now.strftime("%Y-%m-%d %H:%M:%S")
print("current time", current_time)

try:
    cursor = conn.cursor()
    postgres_insert_query = """ insert into padoms_padoms (title, memo, created, completed, user_id) VALUES (%s,%s,%s,%s,%s)"""
    record_to_insert = ('TEST', dati_apr,current_time, 'false', 19)
    cursor.execute(postgres_insert_query, record_to_insert)
    conn.commit()
    count = cursor.rowcount
    print(count, "Record inserted successfully")
except (Exception, psycopg2.Error) as error:
    print("Failed to insert record", error)

finally:
    if conn:
        cursor.close()
        conn.close()
        print("PostgreSQL connection is closed")
