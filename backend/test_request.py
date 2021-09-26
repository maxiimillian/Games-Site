import requests 

payload = {
    "username": "testuser",
    "password": "password",
    "email": "test@exmapl.com",
}

headers = {
    "Content-Type": "application/json",
}

r = requests.post(url="http://localhost:3000/poker" )
