import * as React from 'react';

// NOTE: this will be refactored
const background = document.querySelector('html');
background.style.cssText = "background-color: CornflowerBlue; color: white";

// gets the top stories from our flask backend
async function storiesGet(numStories) {
  const url = `https://better-hn-backend.herokuapp.com/stories?num_stories=${numStories}`
  // url to our flask backend to get the top `numStories` stories
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    return data["stories"];
  } catch (e) {
    console.error("ERROR", e);
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
    // empty list (perhaps something wrong with backend)
    return <h2>No Stories</h2>;
  }

  return (
    <ol>
      {data.map((story) => {
        const storyUrl = story.url ? story.url : `https://news.ycombinator.com/item?id=${story.id}`
        // some posts do not have urls; in that case, link back to the original post
        return (
          <li key={story.id} style={{margin: "15px"}}>
            <h3>
              <a style={{color: "blue"}} href={storyUrl} target='_blank' rel="noreferrer">
                {story.title}
              </a>
            </h3>
            <h3>
              {/* pre keeps the whitespace intact */}
              <pre>{`Date:     ${getDate(story.time)}`}</pre>
              <pre>{`Score:    ${story.score}`}</pre>
              <pre>{`Author:   ${story.by}`}</pre>
              <pre><a href={`https://news.ycombinator.com/item?id=${story.id}`} target='_blank' rel="noreferrer" style={{color: "orange"}}>Click for comments</a></pre>
            </h3>
            <hr></hr>
          </li>
        )
      })}
    </ol>
  );
}

// basically will return the correct formatting based on numStories
const formatLine = (numStories) => {
  if (numStories === 1) {
    return `Hello World! Recent Top Hacker News Story 📰`;
  } else {
    return `Hello World! Recent Top ${numStories} Hacker News Stories 📰`;
  }
};

// implementation for button to control how many stories to view
const StoryNumber = ({setNumStories}) => {

  const getNumStories = () => {
    const value = document.getElementById("numStories").value;
    const x = Math.floor(value);
    console.log(typeof value, typeof x, value, x);
    if (x > 0 && x <= 500) {
      setNumStories(x);
    } else {
      alert("Enter a valid number between 1 to 500 inclusive!");
    }
  };

  return (
    <div style={{margin: "20px"}}>
      <label htmlFor='numStories' style={{color: "orange", fontFamily: "monospace", fontSize: "12pt", fontWeight: "bold"} }>How many stories to display? </label>
      <input id='numStories' placeholder="1 to 500" type="number" min="1" max="500" style={{borderRadius: "5px"}}></input>
      <button onClick={getNumStories} style={{borderRadius: "5px", cursor: "pointer", backgroundColor: "transparent", border: "none"}}>🔘</button>
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
    });
  }, [numStories]);

  return (
    <>
      <h1 style={{color: "yellow", textAlign: "center", paddingTop: "30px", paddingBottom: "35px", fontFamily: "segoe ui"}}>
        {formatLine(numStories)}
      </h1>

      {
        isLoading 
        ? <h3><p style={{textAlign: "center"}}> 🐈 Loading stories, please wait...</p></h3> 
        : <> <StoryNumber setNumStories={setNumStories}/> <List data={stories}/> </>
      }

      {/* the ternary operator will show a loading screen if isLoading is true,
      otherwise it will show the list of stories */}
    </>
  );
};

export default App;
