const apiKey = 'live_kRG2pjRtZRuBRXeD8sNTIWaet2GGAWJOE3aNgvbD6A0bRwrY79LippxpQ9Rx69Aa'; 

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

function fetchBreeds() {
  const url = 'https://api.thecatapi.com/v1/breeds';

  return fetch(url, {
    headers: {
      'x-api-key': apiKey
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch breeds.');
      }
      return response.json();
    })
    .then(data => {
      return data.map(breed => ({
        id: breed.id,
        name: breed.name
      }));
    });
}

function fetchCatByBreed(breedId) {
  const url = `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`;

  return fetch(url, {
    headers: {
      'x-api-key': apiKey
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch cat by breed.');
      }
      return response.json();
    });
}

function populateBreeds() {
  fetchBreeds()
    .then(breeds => {
      breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed.id;
        option.textContent = breed.name;
        breedSelect.appendChild(option);
      });
      breedSelect.disabled = false;
      loader.style.display = 'none';
    })
    .catch(() => {
      error.style.display = 'block';
      loader.style.display = 'none';
    });
}

function handleBreedSelect() {
  const breedId = breedSelect.value;

  catInfo.innerHTML = '';
  catInfo.style.display = 'none';
  loader.style.display = 'block';
  error.style.display = 'none';

  fetchCatByBreed(breedId)
    .then(cats => {
      cats.forEach(cat => {
        const catImage = document.createElement('img');
        catImage.src = cat.url;
        catInfo.appendChild(catImage);

        const breedName = document.createElement('h2');
        breedName.textContent = cat.breeds[0].name;
        catInfo.appendChild(breedName);

        const description = document.createElement('p');
        description.textContent = cat.breeds[0].description;
        catInfo.appendChild(description);

        const temperament = document.createElement('p');
        temperament.textContent = `Temperament: ${cat.breeds[0].temperament}`;
        catInfo.appendChild(temperament);
      });

      catInfo.style.display = 'block';
      loader.style.display = 'none';
    })
    .catch(() => {
      error.style.display = 'block';
      loader.style.display = 'none';
    });
}

breedSelect.addEventListener('change', handleBreedSelect);

loader.style.display = 'block';
error.style.display = 'none';
breedSelect.disabled = true;

populateBreeds();