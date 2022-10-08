'use strict';

// This is the global list of the stories, an instance of StoryList

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
	storyList = await StoryList.getStories();
	$storiesLoadingMsg.remove();

	putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
	// console.debug("generateStoryMarkup", story);

	const hostName = story.getHostName();
	return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
	console.debug('putStoriesOnPage');

	$allStoriesList.empty();

	// loop through all of our stories and generate HTML for them
	for (let story of storyList.stories) {
		const $story = generateStoryMarkup(story);
		$allStoriesList.append($story);
	}

	$allStoriesList.show();
}
function putFavoritesListOnPage() {
	console.debug("putFavoritesListOnPage");
  
	$favoritedStories.empty();
  
	if (currentUser.favorites.length === 0) {
	  $favoritedStories.append("<h5>No favorites added!</h5>");
	} else {
	  // loop through all of users favorites and generate HTML for them
	  for (let story of currentUser.favorites) {
		const $story = generateStoryMarkup(story);
		$favoritedStories.append($story);
	  }
	}
  
	$favoritedStories.show();
  }
  
  /** Handle favorite/un-favorite a story */
  
  async function toggleStoryFavorite(evt) {
	console.debug("toggleStoryFavorite");
  
	const $tgt = $(evt.target);
	const $closestLi = $tgt.closest("li");
	const storyId = $closestLi.attr("id");
	const story = storyList.stories.find(s => s.storyId === storyId);
  
	// see if the item is already favorited (checking by presence of star)
	if ($tgt.hasClass("fas")) {
	  // currently a favorite: remove from user's fav list and change star
	  await currentUser.removeFavorite(story);
	  $tgt.closest("i").toggleClass("fas far");
	} else {
	  // currently not a favorite: do the opposite
	  await currentUser.addFavorite(story);
	  $tgt.closest("i").toggleClass("fas far");
	}
  }

async function getStoryValues() {
	
	let storyTitle = $('#story-title').val();
	let authorData = $('#author-input').val();
	let urlData = $('#url-input').val();
	let username = currentUser.username;
	const allData = (storyTitle, urlData, authorData, username);

	const story = await storyList.addStory(currentUser, allData);

	const $story = generateStoryMarkup(story);
	$allStoriesList.prepend($story);

	$submitForm.slideUp("slow");
  	$submitForm.trigger("reset");
}
$addStoryForm.on('submit', getStoryValues);


