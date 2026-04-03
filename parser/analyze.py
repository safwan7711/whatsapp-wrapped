import sys
import numpy as np
import json
import re
from datetime import datetime

def parse_message(filename):
    pattern = r'\[(\d{2}/\d{2}/\d{4}), (\d{2}:\d{2}:\d{2})\] (\w+) \[(?:REPLY TO\] (\w+)|INDEPENDENT\]): (.+)'
    messages =[]
    with open(filename, 'r',encoding='utf-8') as f:
        lines = f.readlines()
        for line in lines:
            match = re.match(pattern, line) # find match from the start
            if match:
                date_str, time_str, sender, reply_to, content = match.groups()
                datetime_str = date_str + ' ' + time_str
                datetime_obj = datetime.strptime(datetime_str, "%d/%m/%Y %H:%M:%S") # Convert string to datetime object
                messages.append({
                    'datetime': datetime_obj,
                    'sender': sender,
                    'reply_to': reply_to,
                    'message': content
                })
    return messages

def total_messages(messages):
    messageDict = {}
    for message in messages:
        sender = message['sender']
        if sender in messageDict:
            messageDict[sender]+=1
        else:
            messageDict[sender] = 1
    return messageDict

def total_words(messages):
    wordDict = {}
    for message in messages:
        sender = message['sender']
        word_count = len(re.findall(r'\w+', message['message'])) # count words
        if sender in wordDict:
            wordDict[sender]+=word_count
        else:
            wordDict[sender] = word_count
    return wordDict 

def night_owl(messages):
    night_owlDict = {}
    for message in messages:
        hour = message['datetime'].hour
        if hour >=0 and hour <= 5:
            sender = message['sender']
            if sender in night_owlDict:
                night_owlDict[sender]+=1
            else:
                night_owlDict[sender] = 1
    if not night_owlDict:
        return "No night owls found"
    night_owl_guy =sorted(night_owlDict.items(), key = lambda x: x[1], reverse=True)[0][0]
    return night_owl_guy

def ghost(messages):
    reply_count = {}
    for message in messages:
        if message['reply_to']:
            reply_to = message['reply_to']
            if reply_to in reply_count:
                reply_count[reply_to] += 1
            else:
                reply_count[reply_to] = 1
    message_count = total_messages(messages)
    ghost_dict = {
        person: reply_count[person] /message_count[person]
        for person in message_count
    }
    ghost_guy= sorted(ghost_dict.items(), key = lambda x: x[1], reverse=True)[0][0]
    return ghost_guy   

""" def conversation_starters(messages):

def most_used_emojis(messages):

def busiest_day(messages):

def longest_silence(messages):

def avg_response_time(messages):

def hype_person(messages):

def json_format(messages):  """

def main():
    if len(sys.argv)!= 2:
        print("Usage: python analyze.py <chat.txt>")
        return
    filename = sys.argv[1]
    messages = parse_message(filename)
    """ output_stats = json_format(messages)
    with open('data.json', 'w') as f:
        json.dump(output_stats, f) """
    
    print(total_messages(messages))
    print(total_words(messages))
    print(night_owl(messages))
    print(ghost(messages))

if __name__ == "__main__":
    main() 