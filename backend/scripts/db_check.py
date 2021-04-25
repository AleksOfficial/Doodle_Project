# With this script, we will make the server send an http-request to itself (localhost) every single minute 
# The request will query a php file, which checks the dates and sends an email to the finished polls/ sends a warning to the remaining votes 

import requests
import time

while(42):
    http = requests.get('http://127.0.0.1/doodle_project/backend/scripts/check_polls.php')
    
    print(http.text)
    time.sleep(5)
