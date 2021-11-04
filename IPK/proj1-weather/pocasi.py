#!/usr/bin/env python3
# Řešení IPK-proj1-var2, 20.2.2019
# Autor: Jakub Gajdošík, FIT

import sys
import socket

#variables
api_key = sys.argv[1]
city = sys.argv[2]

host = "api.openweathermap.org"
port = 80
request = "GET /data/2.5/weather?q=" + city +"&APPID=" + api_key + "&units=metric HTTP/1.0\r\nHost: api.openweathermap.org\r\n\r\n"

#socket creation
try:
	s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
except socket.error:
	sys.stderr.write('Socket creation error\n')
	sys.exit()

#connecting to server
try:
	s.connect((host,port))
except socket.error:
	sys.stderr.write('Connecting to host error\n')
	s.close()
	sys.exit()

#sending request
try:
	s.send(request.encode())
except socket.error:
	sys.stderr.write('Sending request error\n')
	s.close()
	sys.exit()

#receiving data
try:
	data = s.recv(4096)
except socket.error:
	sys.stderr.write('Receive data error\n')
	s.close()
	sys.exit()

data = data.decode()

#testing error codes
if data.find("200", 0, data.find("/n")) != -1:
	#html header cut
	data = eval(data[data.find("{"):])
	#printing data
	print(data["name"])
	print(data["weather"][0]["description"])
	print("temp: "+str(data["main"]["temp"])+"deg")
	print("humidity: "+str(data["main"]["humidity"])+"%")
	print("pressure: "+str(data["main"]["pressure"])+"hPa")
	print("wind-speed: "+str(round(3.6*data["wind"]["speed"],2))+"km/h") #openweathermaps have speed in m/s so we convert it *3.6
	
	if "deg" in data["wind"]:
		print("wind-deg: "+str(data["wind"]["deg"]) )
	else:
		print("wind-deg: N/A")

elif  data.find("401", 0, data.find("/n")) != -1:
	sys.stderr.write('Server error: invalid API key\n')
elif  data.find("404", 0, data.find("/n")) != -1:
	sys.stderr.write('Server error: city not found\n')
elif  data.find("429", 0, data.find("/n")) != -1:
	sys.stderr.write('Server error: API key blocked\n')
elif  data.find("500", 0, data.find("/n")) != -1:
	sys.stderr.write('Server error: internal server error\n')
else:
	sys.stderr.write('Unknown server error\n')

#closing the socket
s.close()
