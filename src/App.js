import * as React from 'react';

const numStories = 20;
// cannot be >= 500

const background = document.querySelector('html');
background.style.cssText = "background-color: CornflowerBlue; color: PaleGoldenRod";

// get the top numStories amount of stories
const storiesGet = async () => {
  const url = "https://hacker-news.firebaseio.com/v0/topstories.json";
  try {
    const resp = await fetch(url);
    const data = await resp.json();

    // const storyList = await Promise.all(data.map((itemID) => storyItemGet(itemID).then(res => res)));
    // gets an array of promises.
    // this would get 500 promises, which takes a long time

    let arr = [];
    for (let i = 0; i < numStories; i++) {
      arr.push(storyItemGet(data[i]).then(res => res));
    }
    const storyList = await Promise.all(arr)
    // this new code chooses to only get info for the top `numStories`
    // which makes it faster

    return storyList;
  } catch (e) {
    console.error("ERROR", e);
  }
};

// returns a Promise; get information for a single story
const storyItemGet = async (itemID) => {
  const url = `https://hacker-news.firebaseio.com/v0/item/${itemID}.json`
  try {
    const resp = await fetch(url);
    const storyItem = await resp.json();
    return storyItem;
  } catch {
    console.error("ERROR: Can't get story item");
  }
};

// function to get date of when the story was written
const getDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('en-AU');
}

// returns ordered list of the top stories
const List = ({data}) => {
  return (
    <ol>
      {data.map((story) => (
        <li key={story.id}>
          <h4>
            <a href={story.url} target='_blank' rel="noreferrer">
              {story.title}
            </a>
          </h4>
          <h3>
            <pre>{`Date:     ${getDate(story.time)}`}</pre>
            <pre>{`Score:    ${story.score}`}</pre>
            <pre>{`Author:   ${story.by}`}</pre>
            {/* pre keeps the whitespace intact */}
          </h3>
          <hr></hr>
        </li>
      ))}
    </ol>
  );
}

const App = () => {
  const [stories, setStories] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    storiesGet().then(resp => {
      setStories(resp);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <h1>{`Hello World! Top ${numStories} Hacker News Stories`}</h1>
      
      {isLoading 
      ? <p>Loading stories, please wait...</p> 
      : <List data={stories}/>
      }

      {/* the ternary operator will show a loading screen if isLoading is true,
      otherwise it will show the list of stories */}
    </>
  );
};

export default App;
