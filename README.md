# Better Hacker News 🐈

Visit the website [here!](https://better-hnews.herokuapp.com/) 

*Please note that as it is currently hosted on the free heroku plan, the server does take a while to load on initial loadup.*

## Description

This project was made as alternative for the website at: https://news.ycombinator.com/.

It was made with the aim of having an easier to read interface, with much larger fonts, spacing and more contrasting colours.

It shows the top 20 stories by default, which was chosen to prevent spending too much time trawling through the various stories.

**The number of stories to show can be changed, by entering a number between 1-500 inclusive and then clicking the button next to the input box.**

There is a Flask backend which handles retrieving the stories from Hacker News API, which uses the official Hacker News API to retrieve up to the top 500 stories.

You can find the code for the backend [here](https://github.com/waterfalle/better-hn-backend).

## Screenshot

![preview](https://github.com/waterfalle/better-hn/blob/main/img/preview.png)

## Contributing

If you have an idea or found a possible bug, please submit a Github issue so that I can fix it. Thanks!
