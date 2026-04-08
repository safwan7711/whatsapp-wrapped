import sys
import numpy as np
import json
import re
from datetime import datetime, timedelta

def parse_message(filename):
    #TODO:parse the message by matching the pattern 
    # and return a list of dictionaries with datetime, sender, message, reply_to.
    pattern = r'\[(\d{2}/\d{2}/\d{4}), (\d{2}:\d{2}:\d{2})\] (\w+) \[(?:REPLY TO\] (\w+)|INDEPENDENT\]): (.+)' # regex pattern 
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
    #TODO: count total messages per sender and return a dict 
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
        word_count = len(re.findall(r'\w+', message['message'])) # count words using pattern matching
        if sender in wordDict:
            wordDict[sender]+=word_count
        else:
            wordDict[sender] = word_count
    return wordDict 

def night_owl(messages):
    night_owlDict = {}
    for message in messages:
        hour = message['datetime'].hour
        if hour >=0 and hour <= 5: # Consider messages sent between 12 AM and 5 AM as night owl messages
            sender = message['sender']
            if sender in night_owlDict:
                night_owlDict[sender]+=1
            else:
                night_owlDict[sender] = 1
    if not night_owlDict:
        return "No night owls found"
    # finding max value by sorting first using lambda expresiion  
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
    ghost_guy= sorted(ghost_dict.items(), key = lambda x: x[1])[0][0]
    return ghost_guy   

def conversation_starters(messages,x,y,time_range):
    #TODO: find the convo starter, that we define as it s proportional to the time gap**x
    # and the no of time that person has started a conversation**y. 
    # Time range is the minimum time gap in hours to consider for a conversation starter.
    prev_dict = messages[0]
    freq_dict = {} # contains the sender key and a list of freq of messages in the time ranges
    for message in messages:
        sender = message['sender']
        #find time gap between current message and previous message
        time_gap =(message['datetime']-prev_dict['datetime']).total_seconds()/3600 
        n = int(time_gap//time_range)
        if n == 0: # if gap is less than time_range ignore
            continue
        if sender in freq_dict:
            # freq_list contains the list of frequencies for a sender in the loop
            freq_list = freq_dict[sender]
            # extend the list if n > curr len of freq_list
            if n>=len(freq_list):
                freq_list += [0 for i in range(n-len(freq_list)+1)]
            freq_list[n]+=1
        else:
            freq_list =[0 for  i in range(n)]+[1]
            freq_dict[sender] = freq_list
        prev_dict = message
    convo_dict = {}
    for sender, freq_list in freq_dict.items():
        convo_dict[sender] = 0 # initialize to 0
        for i in range(len(freq_list)):
            convo_dict[sender] += i**x +freq_list[i]**y
    convo_guy = sorted(convo_dict.items(), key = lambda x: x[1], reverse=True)[0][0]
    return convo_guy

def most_used_emojis(messages):
    #TODO: find top 3 emojis used y each person 
    # and return a dict of sender and list of emojis.
    EMOJI_PATTERN = re.compile( # compile the regex pattern for emojis
    "["
    "\U0001F600-\U0001F64F" # Emoticons
    "\U0001F300-\U0001F5FF" # Symbols & Pictographs
    "\U0001F680-\U0001F6FF" # Transport & Map Symbols
    "\U0001F900-\U0001F9FF" # Supplemental Symbols
    "\u2600-\u27BF"         # Miscellaneous Symbols & Dingbats
    "]", flags=re.UNICODE)
    emoji_dict = {}
    for message in messages:
        sender = message['sender']
        emojis = EMOJI_PATTERN.findall(message['message'])
        if sender in emoji_dict:
            emoji_dict[sender] += emojis
        else:
            emoji_dict[sender] = emojis
    top__emoji_dict = {}
    for sender, emojis in emoji_dict.items():
        emoji_count = {}
        for emoji in emojis:
            if emoji in emoji_count:
                emoji_count[emoji] += 1
            else:
                emoji_count[emoji] = 1
        # sort the emojis by count and get the top 3
        top_emojis = sorted(emoji_count.items(), key = lambda x: x[1], reverse=True)[:3]
        # store only the emojis in the final dict
        top__emoji_dict[sender] = [emoji for emoji,count in top_emojis]
    return top__emoji_dict

def busiest_day(messages):
    mess_day_dict ={}
    for message in messages:
        day = message['datetime'].strftime("%Y-%m-%d") # in str format
        if day in mess_day_dict:
            mess_day_dict[day]+=1
        else:
            mess_day_dict[day]=1
    busiest_day = sorted(mess_day_dict.items(), key = lambda x :x[1], reverse =True)[0][0]
    return busiest_day

def longest_silence(messages):
    longest_gap =timedelta() # initialize longest gap to 0
    prev_time= messages[0]['datetime']
    for message in messages:
        time_gap = (message['datetime'] -prev_time)
        if time_gap > longest_gap:
            longest_gap = time_gap
        prev_time = message['datetime']
    if longest_gap.days > 0:
        return longest_gap.days
    else:
        return longest_gap.seconds//3600 # return in hours if less than a day

def avg_response_time(messages):
    #TODO: find list of response times for each person into a dict
    # then find the median of the list and return a dict
    response_time = {}
    prev = messages[0]
    for message in messages:
        sender = message['sender']
        if prev['sender'] == sender: # if same sender ignore
            prev = message
            continue
        time_gap = (message['datetime'] - prev['datetime']).total_seconds()//60 # convert to minutes
        if time_gap > 180: # ignoring if time gap > 3 hours as it is unlikely to be a reply 
            prev = message
            continue
        if sender in response_time:
            response_time[sender].append(time_gap)
        else:
            response_time[sender] = [time_gap]
        prev = message
    # def median func 
    def median(lst):
        sorted_lst = sorted(lst)
        if len(lst) %2 == 0:
            return (sorted_lst[len(lst)//2 -1] + sorted_lst[len(lst)//2])/2
        else:
            return sorted_lst[len(lst)//2]
    median_resp_time = {}
    for sender,time_lst in response_time.items():
        median_resp_time[sender]= median(time_lst)
    return median_resp_time

def hype_person(messages):
    median_resp_time = avg_response_time(messages)
    # hype guy is the one with lowest median response time.
    hype_guy = sorted(median_resp_time.items(), key = lambda x: x[1])[0][0]
    return hype_guy

def json_format(messages):
    output = {
        "group": {
            "busiest_day": busiest_day(messages),
            "longest_silence": longest_silence(messages),
            "night_owl": night_owl(messages),
            "ghost": ghost(messages),
            "hype_person": hype_person(messages),
            "conversation_starters": conversation_starters(messages,1,2,4),
        },
        "persons": {}
    }
    for person in total_messages(messages).keys():
        output['persons'][person] = {
            "total_messages": total_messages(messages).get(person, 0),
            "total_words": total_words(messages).get(person, 0),
            "most_used_emojis": most_used_emojis(messages).get(person, []),
            "avg_response_time": avg_response_time(messages).get(person, 0)
        }
    return output
 
def main():
    if len(sys.argv)!= 2:
        print("Usage: python analyze.py <chat.txt>")
        return
    filename = sys.argv[1]
    messages = parse_message(filename)
    output_stats = json_format(messages)
    with open('data.json', 'w') as f:
        json.dump(output_stats, f, ensure_ascii=False, indent=2)# ensure_ascii=False to preserve emojis

# just for testing the functions
    """ print(total_messages(messages))
    print(total_words(messages))
    print(night_owl(messages))
    print(ghost(messages))
    print(conversation_starters(messages,1,2,4))
    print(most_used_emojis(messages))
    print(busiest_day(messages))
    print(longest_silence(messages))
    print(avg_response_time(messages))
    print(hype_person(messages)) """
    
if __name__ == "__main__":
    main() 