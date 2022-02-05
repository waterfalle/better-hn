import * as React from 'react';

const background = document.querySelector('html');
background.style.cssText = "background-color: CornflowerBlue; color: white";

// get the top numStories amount of stories

// NOTE: two methods below; both do the same thing, except that one uses
// await async and the other uses .then, .catch

// const storiesGet = async () => {
//   const url = "https://hacker-news.firebaseio.com/v0/topstories.json";
//   return fetch(url)
//   .then(resp => resp.json())
//   .then(data => {
//     let arr = [];
//     for (let i = 0; i < numStories; i++) {
//       arr.push(storyItemGet(data[i]).then(res => res));
//     }
//     return Promise.all(arr);
//   })
//   .then(storyList => storyList);
// };

const storiesGet = async (numStories) => {
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
  if (data === undefined) {
    // empty list
    return <h2>No Stories</h2>;
  }

  data.sort((a, b) => {
    return b.score - a.score;
  })
  // the above will sort the stories based on the story's score 
  // in descending order
  return (
    <ol>
      {data.map((story) => {
        const storyUrl = story.url ? story.url : `https://news.ycombinator.com/item?id=${story.id}`
        return (
          <li key={story.id} style={{margin: "15px"}}>
            <h3>
              {}
              <a style={{color: "blue"}} href={storyUrl} target='_blank' rel="noreferrer">
                {story.title}
              </a>
            </h3>
            <h3>
              <pre>{`Date:     ${getDate(story.time)}`}</pre>
              <pre>{`Score:    ${story.score}`}</pre>
              <pre>{`Author:   ${story.by}`}</pre>
              <pre><a href={`https://news.ycombinator.com/item?id=${story.id}`} target='_blank' rel="noreferrer" style={{color: "orange"}}>Click for comments</a></pre>
              {/* pre keeps the whitespace intact */}
            </h3>
            <hr></hr>
          </li>
        )
      })}
    </ol>
  );
}

const StoryNumber = ({setNumStories}) => {

  const getNumStories = () => {
    const value = document.getElementById("numStories").value;
    const x = Math.floor(value);
    console.log(typeof value, typeof x, value, x);
    if (x > 0 && x < 500) {
      setNumStories(x);
    }
  };

  return (
    <div style={{margin: "20px"}}>
      <label htmlFor='numStories' style={{color: "orange", fontFamily: "monospace", fontSize: "12pt", fontWeight: "bold"} }>How many stories to display? </label>
      <input id='numStories' placeholder="1 to 499" type="number" min="1" max="499" style={{borderRadius: "5px"}}></input>
      <span>  </span>
      <button onClick={getNumStories} style={{borderRadius: "5px"}}>Enter</button>
      <br></br>
      <br></br>
    </div>
  );
}

const App = () => {
  const [stories, setStories] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [numStories, setNumStories] = React.useState(20);

  React.useEffect(() => {
    setIsLoading(true);
    storiesGet(numStories)
    .then(setStories)
    .finally(() => {
      setIsLoading(false);
      console.log("world");
    });
  }, [numStories]);

    console.log("hello", isLoading);
    // console should show:
    // hello false
    // hello true
    // hello true
    // hello false
    // world

  return (
    <>
      <h1 style={{color: "yellow", textAlign: "center", paddingTop: "30px", paddingBottom: "35px", fontFamily: "monospace"}}>
        {`Hello World! Top Recent ${numStories} Hacker News Stories`}
      </h1>

      {isLoading 
      ? <h3><p style={{textAlign: "center"}}> 🐈 Loading stories, please wait...</p></h3> 
      : <> <StoryNumber setNumStories={setNumStories}/> <List data={stories}/> </>
      }

      {/* the ternary operator will show a loading screen if isLoading is true,
      otherwise it will show the list of stories */}
    </>
  );
};

export default App;
