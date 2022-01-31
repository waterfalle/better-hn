import * as React from 'react';

const storiesGet = async () => {
  const url = "https://hacker-news.firebaseio.com/v0/topstories.json";
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    const storyList = await Promise.all(data.map((itemID) => storyItemGet(itemID).then(res => res)));
    // gets an array of promises.
    console.log(storyList)
    return storyList;
  } catch (e) {
    console.error("ERROR", e);
  }
};

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

const List = ({data}) => {
  return (
    <ol>
      {data.map((story) => (
        <li key={story.id}>
          <a href={story.url} target='_blank' rel="noreferrer">
            {story.title}
          </a>
          <br></br>
          <span>Score:    {story.score}</span>
          <br></br>
          <span>Author:   {story.by}</span>
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
      <h1>Hello World! Top 500 Hacker News Stories</h1>
      {isLoading ? <p>Loading stories, please wait...</p> : <List data={stories}/>}
      {/* the ternary operator will show a loading screen if isLoading is true,
      otherwise it will show the list of stories */}
    </>
  );
};

export default App;
