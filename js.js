const API_KEY = 'e0d8818c1bbcc39b785a1d51897c0a95';
const SET_NUMBERS = ['21318-1', '10266-1', '75936-1', '42100-1', '75192-1', '71043-1'];
const BASE_URL = 'https://rebrickable.com/api/v3/lego/sets/';

// Function to fetch LEGO set data
async function fetchLegoSet(setNumber) {
    const API_URL = `${BASE_URL}${setNumber}/`;
    try {
        const response = await fetch(API_URL, {
            headers: {
                'Authorization': `key ${API_KEY}`
            }
        });
        const set = await response.json();
        return set;
    } catch (error) {
        console.error(`Error fetching data for set ${setNumber}:`, error);
    }
}

// Function to display LEGO sets on the main page
async function displayLegoSets() {
    const cards = document.querySelectorAll('.services-card');

    // Fetch all LEGO sets concurrently using Promise.all
    const setsData = await Promise.all(SET_NUMBERS.map(fetchLegoSet));

    // Update the card elements with the fetched data
    setsData.forEach((set, index) => {
        if (index < cards.length && set) {
            const card = cards[index];
            const image = card.querySelector('.card__image');
            const title = card.querySelector('.class__title a');
            const text = card.querySelector('.card__text');
            const button = card.querySelector('.more-btn');

            if (image) {
                image.src = set.set_img_url;
                image.alt = set.name;
            }
            if (title) title.textContent = set.name;
            if (text) text.textContent = `Set Number: ${set.set_num}`;
            if (button) button.setAttribute('onclick', `navigateToDetails('${set.set_num}')`);
        }
    });
}

// Function to navigate to the details page for a specific LEGO set
function navigateToDetails(setNumber) {
    window.location.href = `info.html?setNumber=${setNumber}`;
}

// Function to get query parameter from the URL
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const setNumber = getQueryParameter('setNumber');
const API_URL_SET = `https://rebrickable.com/api/v3/lego/sets/${setNumber}/`;
const API_URL_PARTS = `https://rebrickable.com/api/v3/lego/sets/${setNumber}/parts/`;

// Function to fetch data for a specific LEGO set
async function fetchSetData() {
    try {
        const response = await fetch(API_URL_SET, {
            headers: {
                'Authorization': `key ${API_KEY}`
            }
        });
        const setData = await response.json();
        return setData;
    } catch (error) {
        console.error('Error fetching set data:', error);
    }
}

// Function to fetch parts data for a specific LEGO set
async function fetchPartsData() {
    try {
        const response = await fetch(API_URL_PARTS, {
            headers: {
                'Authorization': `key ${API_KEY}`
            }
        });
        const partsData = await response.json();
        return partsData.results;
    } catch (error) {
        console.error('Error fetching parts data:', error);
    }
}

// Function to display data for a specific LEGO set on the details page
async function displaySetData() {
    const setData = await fetchSetData();
    if (!setData) return;

    const mainImage = document.getElementById('main-image');
    const setTitle = document.getElementById('set-title');
    const setYears = document.getElementById('set-years');
    const setPieces = document.getElementById('set-pieces');

    if (mainImage) {
        mainImage.src = setData.set_img_url;
        mainImage.alt = setData.name;
    }
    if (setTitle) setTitle.textContent = setData.name;
    if (setYears) setYears.textContent = setData.year;
    if (setPieces) setPieces.textContent = setData.num_parts;
}

// Function to display parts data for a specific LEGO set on the details page
async function displayPartsData() {
    const partsData = await fetchPartsData();
    if (!partsData) return;

    const partsContainer = document.getElementById('parts-container');

    partsData.forEach(part => {
        const partItem = document.createElement('div');
        partItem.classList.add('text-center');

        const partImage = document.createElement('img');
        partImage.src = part.part.part_img_url;
        partImage.alt = part.part.name;
        partImage.classList.add('w-full', 'h-auto');

        const partText = document.createElement('p');
        partText.textContent = `${part.quantity} x ${part.part.part_num}`;

        partItem.appendChild(partImage);
        partItem.appendChild(partText);
        partsContainer.appendChild(partItem);
    });
}

// Initialize display of LEGO sets and highlight nav link on DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    displayLegoSets();
    displaySetData();
    displayPartsData();

    // Highlight the current navigation link
    const currentPage = window.location.pathname.split('/').pop();
    const homeLink = document.getElementById('home-link');
    const setsLink = document.getElementById('sets-link');

    if (currentPage === 'home.html' && homeLink) {
        homeLink.classList.add('text-red-600');
    } else if (currentPage === 'sets.html' && setsLink) {
        setsLink.classList.add('text-red-600');
    }
});
