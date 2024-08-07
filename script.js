const gameDisplay = document.getElementById("display");
const gameCategories = document.getElementById("categoryGroup");
const gameTags = document.getElementById("tagGroup");

const searchInput = document.querySelector("#searchForm");
const searchButton = document.querySelector("#store_search_link img");

const displayTitle = document.getElementById("displayTitle");
//Get game data
const getGames = async (
  steamspy_tags,
  searchQuery,
  genres,
  page = 1,
  limit = 10
) => {
  try {
    let url = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com/games`;
    if (steamspy_tags) {
      url += `?steamspy_tags=${encodeURIComponent(steamspy_tags)}`;
    }
    if (searchQuery) {
      url += `?q=${encodeURIComponent(searchQuery)}`;
    }
    if (genres) {
      url += `?genres=${encodeURIComponent(genres)}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error:" + error.message);
  }
};

//Display game
const renderGames = async (steamspy_tags, searchQuery, genres) => {
  try {
    const response = await getGames(steamspy_tags, searchQuery, genres);
    let uI = "";
    response.data.forEach((game) => {
      uI += `
        <div>
          <div class="game_wrapper">
            <div class="cover" onclick="renderGameDetail(${game.appid})">
              <img
                src="${game.header_image}"
                data-id="${game.appid}"
              />
              <div class="game_info">
                <p>${game.name}</p>
                <p>${game.price} $</p>
              </div>
            </div>
          </div>
        </div>
        `;
    });
    gameDisplay.innerHTML = uI;
  } catch (error) {
    console.log("Error rendering genres: " + error.message);
  }
};
//Check render games
renderGames();

//Get genres info
const getGenres = async () => {
  try {
    const url = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com/genres`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error:" + error.message);
  }
};

const renderGenres = async () => {
  try {
    const response = await getGenres();
    let uI = "";
    response.data.forEach((gameCategories) => {
      uI += `
         <li class="genre_action">${gameCategories.name}</li>
        `;
    });
    gameCategories.innerHTML = uI;
    const genresHTML = document.getElementsByClassName("genre_action");

    for (let i = 0, l = genresHTML.length; i < l; i++) {
      let element = genresHTML[i];
      element.addEventListener("click", (event) => {
        renderGames(event.target.innerText);
        displayTitle.innerText = event.target.innerText;
      });
    }
  } catch (error) {
    console.log("Error rendering genres: " + error.message);
  }
};

renderGenres(); // Check

// Fetch tag data
const getTags = async () => {
  try {
    const url = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com/steamspy-tags`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error:" + error.message);
  }
};

const renderTags = async () => {
  try {
    const response = await getTags();
    let uI = "";
    response.data.forEach((gameTags) => {
      uI += `<li class="tag_action">${gameTags.name}</li>`;
    });
    gameTags.innerHTML = uI;
    const tagsHTML = document.getElementsByClassName("tag_action");

    for (let i = 0, l = tagsHTML.length; i < l; i++) {
      let element = tagsHTML[i];
      element.addEventListener("click", (event) => {
        renderGames(event.target.innerText);
        displayTitle.innerText = event.target.innerText;
      });
    }
  } catch (error) {
    console.log("Error rendering tags: " + error.message);
  }
};

renderTags();

//Game Detail

const getGameDetail = async (appid) => {
  try {
    const url = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com/single-game/${appid}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching game details: " + error.message);
  }
};

const renderGameDetail = async (appid) => {
  try {
    const response = await getGameDetail(appid);
    let gameDetail = response.data;
    let uI = `<div class="showing_game show_detail">
    <div class="title_contain ">
    <div class="title">${gameDetail.name}</div>
    <div class="price">${gameDetail.price}$</div>
    </div>
    <div class="img_detail">
    <img
    src="${gameDetail.header_image}"
    alt="${gameDetail.name}"
    />
    <div class="game_details">
    <div class="game_description">${gameDetail.description}</div>
    <div class="game_informations">
    <p>AGE REQUIRED: ${gameDetail.required_age}+</p>
    <p>POSITIVE RATING: ${gameDetail.positive_ratings}</p>
    <p>NEGATIVE RATING: ${gameDetail.negative_ratings}</p>
    <p>RELEASE DATE:  ${gameDetail.release_date}</p>
    <p>DEVELOPER: ${gameDetail.developer}</p>
    <p>PLATFORMS: ${gameDetail.platforms}</p>
    <p>ACHIEVEMENTS: ${gameDetail.achievements}</p>
    </div>
    </div>
    </div>
    <div class="tags_contain">
    Popular user-defined tags for this product:
    <div class="tags">
    <div class="tag">${gameDetail.steamspy_tags[0]}</div>
    <div class="tag">${gameDetail.steamspy_tags[1]}</div>
    <div class="tag">${gameDetail.steamspy_tags[2]}</div>
    <div class="tag">${gameDetail.categories[0]}</div>
    <div class="tag">${gameDetail.categories[1]}</div>
    <div class="tag">${gameDetail.genres[0]}</div>
    <div class="tag">${gameDetail.genres[1]}</div>
    </div>
    </div>
    </div>
    `;

    gameDisplay.innerHTML = uI;
    displayTitle.innerText = gameDetail.name;
  } catch (error) {
    console.log("Error fetching game detail: " + error.message);
  }
};

// Handle search button click
const handleSearch = async (tag = null) => {
  const searchQuery = searchInput.value.trim();
  const selectedTags = Array.from(
    document.querySelectorAll(".tag_action.selected")
  )
    .map((tag) => tag.innerText)
    .join(",");
  const selectedGenres = Array.from(
    document.querySelectorAll(".genre_action.selected")
  )
    .map((genre) => genre.innerText)
    .join(",");

  if (searchQuery || selectedTags || selectedGenres) {
    await renderGames(selectedTags, searchQuery, selectedGenres);
    displayTitle.innerText = `Search results${
      searchQuery ? ` for "${searchQuery}"` : ""
    }${selectedTags ? ` with tags [${selectedTags}]` : ""}${
      selectedGenres ? ` in genres [${selectedGenres}]` : ""
    }`;
  } else {
    console.log("No search criteria specified.");
    await renderGames(); // Optionally render default or all games
    displayTitle.innerText = "Features";
  }
};

// Add event listener to the search button
searchButton.addEventListener("click", handleSearch);

// Add event listener to the search input for "Enter" key
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent the form from submitting
    handleSearch();
  }
});
