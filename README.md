# whatsapp-wrapped

## Usage

### Generator

To generate the chat run python3 chat.py [PATH] [DURATION] and the output `chat.txt` file will be generated in project directory.

### Analyser

To generate the `data.json` file run python3 analyze.py and the file will be generated in the project directory.

### Website

To start the website run a http server from the project directory, i.e python3 -m http.server [PORT] and navigate to web to open the website.

To start the slide show click on the `Start the Show` button

To move to the next slide click on the right 70% of the screen, clicking elsewhere will go back to the previous slide.

After the group slides get over there is a slide which allows users to jump into any user's stats.

After the personal slides are over, click on the dropdown to select users whose stats will be compared on the comparison slide.

## Structure of `data.json`

## Design/Implementation Overview

The project consists of three different components which work in tandem.

### 1. The Chat Generation Script (`chat.py`)

This is independent of the analysis part of the project and creates a chat using the `vocabulary.txt` file.

- The app should work for every vocabulary file.
- The personalities of each person in the chat will be described using a `personality.json` file which can be easily modified to create different chats.
- The following personality parameters will be specified by `personality.json`:
  - **Name**
  - **Active Hours:** A list of tuples of two integers each (start and end ranges).
  - **Yapperness:** (Float Value Between 0 and 1). Based on the talkativeness weight a talkativeness matrix will be generated.
  - **Average Message Length:** (Integer).
  - **Ghoster:** (Float Value between 0 and 1). Tendency to ghost.
- The script will do a time series simulation using the `datetime` module.
- The random selection will be done using a mixture of probability and `np.random` module functions.
- If time permits, a simple Markov chain implementation can be done to create more coherent sentences (This can be implemented practically only for some `vocabulary.txt` files).
- The generated script will tag each message as either being a reply to a previous message or an independent message.

### 2. Analyzer (`Analyzer.py`)

- It reads in the generated `chat.txt` and uses `numpy` to create various analytics.
- The analytics generated are:
  - **Total Messages:** Message Count per person.
  - **Total Words:** Word Count per person.
  - **Night Owl:** Most active sender between 12am and 4am.
  - **Ghosted:** The person who receives the fewest replies.
  - **Conversation Starter:** Most frequent sender after a long silence (1 hr). _(Note: Long silence can be changed by running `analyze.py` with different params)._
  - **Most Used Emoji:** Top 3 emojis per person.
  - **Busiest Day:** Single Day with most messages.
  - **Longest Silence:** Longest gap with zero messages.
  - **Average Response Time:** Average time between 2 messages.
  - **Average Reply Time:** Average time taken to reply to a message (if a reply exists).
  - **Hype Person:** Person with the fastest average message time (from the last message which wasn't theirs).
  - **Chalant Replier:** Person with the fastest average reply time.
- These analytics will be generated into a `data.json` file for easy parsing.
- `data.json` has two different schemas: one for Group Stats (such as Longest Silence) and one for Person Stats.

### 3. Website (`app.js` / `index.html` / `style.css`)

- **`app.js`:** It reads in the `data.json` file and updates `index.html` dynamically. It also contains the logic for making the website responsive.
- Each person gets their own profile slides with all their stats.
- There is also a group stats page which shows a leaderboard and averages for different cumulative stats.
- The project will be styled using Bootstrap to make it responsive and stylish.
