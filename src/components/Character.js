import React, { useState, useEffect } from "react";

import Summary from "./Summary";

const Character = props => {
  const [loadedCharacter, setLoadedCharacter] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // array vazio no segundo argumeto faz parecer um didMount
  // segundo argumento executa quando muda
  // como ele roda tbm quando inicia, dápra usar como didMount
  useEffect(() => {
    fetchData();
  }, [props.selectedChar]);

  const shouldComponentUpdate = (nextProps, nextState) => {
    console.log("shouldComponentUpdate");
    return (
      nextProps.selectedChar !== this.props.selectedChar ||
      nextState.loadedCharacter.id !== this.state.loadedCharacter.id ||
      nextState.isLoading !== this.state.isLoading
    );
  };

  const fetchData = () => {
    console.log(
      "Sending Http request for new character with id " + props.selectedChar
    );
    setIsLoading(true);
    fetch("https://swapi.co/api/people/" + props.selectedChar)
      .then(response => {
        if (!response.ok) {
          throw new Error("Could not fetch person!");
        }
        return response.json();
      })
      .then(charData => {
        const loadedCharacter = {
          id: props.selectedChar,
          name: charData.name,
          height: charData.height,
          colors: {
            hair: charData.hair_color,
            skin: charData.skin_color
          },
          gender: charData.gender,
          movieCount: charData.films.length
        };
        console.log(loadedCharacter);
        setLoadedCharacter(loadedCharacter);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  let content = <p>Loading Character...</p>;
  if (!isLoading && loadedCharacter.id) {
    content = (
      <Summary
        name={loadedCharacter.name}
        gender={loadedCharacter.gender}
        height={loadedCharacter.height}
        hairColor={loadedCharacter.colors.hair}
        skinColor={loadedCharacter.colors.skin}
        movieCount={loadedCharacter.movieCount}
      />
    );
  } else if (!isLoading && !loadedCharacter.id) {
    content = <p>Failed to fetch character.</p>;
  }

  return content;
};

export default Character;
