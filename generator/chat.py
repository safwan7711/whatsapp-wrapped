import os
import json
import datetime
import numpy as np
# The chat generation can be done well with np.random.choice(cuz there is a probability option)
# 
class Generator:
    def __init__(self, personjson="personality.json", vocab="../vocabulary.txt",output="../chat.txt"):
        #The initializer for the generator class will create the vocabulary and 
        self.log=[]
        if os.path.exists(personjson):
            with open(personjson,'r') as x:
                ##TODO: Create a function to verify if file is of correct format
                self.personality = json.load(x)
        else:
            raise FileNotFoundError(f"The personality.json file is not present in the specified location")
        if os.path.exists(vocab):
            with open(vocab,'r') as x:
                self.vocab = x.read().strip().split(',')
        else:
            raise FileNotFoundError(f"The vocabulary.txt file is not present in the specified location")
        self.output=output
        if not os.path.exists(output):
            print(f"Output File missing.... \n Creating a new file....")
        else:
            print(f"Output File found ....")
    def gen_message(self,length):
        # Generates a message
        # For now I will use a simple np.random to generate the message
        ##TODO: Update message generation to be more coherent
        ##TODO: Update message generation with punctuation probabilities
        message = ""
        for i in range(length):
            message += np.random.choice(self.vocab) + " "
        return message
    def is_active(self,person,time):
        #Checks if user is active or not
        for start,end in person["Active Hours"]:
            # Since I use time.hour to pass it into this list, we treat active hours as [start,end) interval
            if time >=start and time < end:
                return True
        return False
    def relationship_gen(self):
        #Makes a relationship matrix to find probability of a message being a reply
        x = [[0 for i in self.personality] for j in self.personality]
        for i in range(len(self.personality)):
            for j in range(len(self.personality)):
                factor1= 1+np.random.random()*0.2 - 0.1
                factor2 = 1+np.random.random()*0.2 - 0.1
                if i!=j:
                    x[i][j] = self.personality[i]["Yapperness"]*factor1*factor2*self.personality[j]["Yapperness"] 
        return x

    def gen_chat(self,days):
        yappuh_matrix = self.relationship_gen()
        #Initializing the time variables
        start = datetime.datetime.now() - datetime.timedelta(days)
        end = datetime.datetime.now()
        time = start
        """
        Format of self.log is list of dictionaries of the form
            {
                'time': current time,
                'name': name of the sender,
                'tag': whether it is a reply or an independent message,
                'reply to' : who the message is replying to(empty if its an independent message)
                'content': message content
            }
        """
        while(time<=end):
            active =[]
            for i in self.personality:
                if self.is_active(i,time.hour):
                    active.append(i)
            if len(active)==0:
                time += datetime.timedelta(hours=0.5)
                continue
            yap_score = []
            for i in active:
                yap_score.append(i["Yapperness"])
            # Selects sender based on yapper weight
            yap_prob = [i / sum(yap_score) for i in yap_score]
            sender_index = np.random.choice(len(active), p=yap_prob)
            sender = active[sender_index]
            reply = False
            ghost = False
            replied = ""
            if self.log:               
                if np.random.rand() < sender['Ghoster'] and (time -self.log[-1]["time"]).total_seconds()<7200:
                    #Maximum time between messages can be 2 hrs
                    ghost = True
                if ghost:
                    time += datetime.timedelta(minutes=np.random.randint(30, 50))
                    continue
                rep_prob = [0 for i in range(min(len(self.log),7))]
                send_index = 0
                for i in range(len(self.personality)):
                    if self.personality[i]==sender:
                        send_index = i
                        break
                rep_prob = [0 for i in range(min(len(self.log),7))]
                for i in range(min(len(self.log),7)):
                    #A message can be replied to only if it is in the last 7 messages
                    if self.log[-i-1]["name"].strip() != sender["Name"]:
                        index = 0
                        for j in range(len(self.personality)):
                            if self.personality[j]["Name"]==self.log[-i-1]["name"].strip():
                                index = j
                                break
                        #Reply probability is based on the relationship_gen() function
                        rep_prob[i] = yappuh_matrix[send_index][index]
                        if np.random.random()*(1.3*sum(rep_prob)) > sum(rep_prob):
                            reply = True
                            
                if reply:
                    prob_sum = sum(rep_prob)
                    #Normalize the probability distribution so that it adds up to 1
                    if prob_sum > 0:
                        norm_rep_prob = [p / prob_sum for p in rep_prob]
                    else:
                        norm_rep_prob = [1.0 / len(rep_prob)] * len(rep_prob)   
                    recent_logs = self.log[-1:-(min(len(self.log),7)+1):-1]
                    replied_index = np.random.choice(len(recent_logs), p=norm_rep_prob)
                    replied = " " + recent_logs[replied_index]["name"]

            avg_len = sender["Average Message Length"]
            # Use normal distribution to vary message length around the average
            msg_length = max(1, int(np.random.normal(avg_len, max(1, avg_len/3))))
            message_content = self.gen_message(msg_length)
            tag = "[REPLY TO]" if reply else "[INDEPENDENT]"
            self.log.append({
                'time': time,
                'name': sender['Name'],
                'tag': tag,
                'reply to': replied,
                'content': message_content
            })
            #Export the chat log
            self.export()
            # time increases slower if it is a reply
            if reply:
                # Fast replies during an active conversation
                time += datetime.timedelta(minutes=np.random.randint(1, 3))
            else:
                # Slower progression for new independent thoughts
                time += datetime.timedelta(minutes=np.random.randint(5, 27))

    def export(self):
        #Formats self.log and writes it to chat.txt
        lines =[]
        for i in self.log:
            timestamp = timestamp = i['time'].strftime("%d/%m/%Y, %H:%M:%S")
            lines.append(f"[{timestamp}] {i['name']} {i['tag']}{i["reply to"]}: {i['content']}\n")
        with open(self.output,'w') as x:
            x.writelines(lines)
generator = Generator()
generator.gen_chat(3)
