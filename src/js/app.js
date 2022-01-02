import myRefs from './refs';
import ImageApiService from './api-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default () => {
  const refs = myRefs;
  const imageApiPictures = new ImageApiService();

  const onSearch = e => {
    e.preventDefault();
    imageApiPictures.query = e.currentTarget.elements.searchQuery.value;

    if (imageApiPictures.query === '' || imageApiPictures.searchQuery.trim() === '') {
      return Notify.failure('Field can not be empty!');
    }

    imageApiPictures.resetPage();

    imageApiPictures.getImage().then(({ hits, totalHits }) => {
      cardsReset();
      if (totalHits === 0) {
        return errorWatch();
      }

      appendNewCards(hits);
      firstTotalHits(totalHits);

      if (imageApiPictures.perPage > totalHits) {
        refs.loadMoreBtn.style.display = 'none';
      } else {
        refs.loadMoreBtn.style.display = 'block';
      }

      refs.searchInput.value = '';
    });
  };

  const onLoadMore = () => {
    imageApiPictures.getImage().then(({ hits, totalHits }) => {
      appendNewCards(hits);

      if (imageApiPictures.perPage * (imageApiPictures.page + 1) >= totalHits) {
        return (refs.loadMoreBtn.style.display = 'none');
      }
    });
  };

  const appendNewCards = cards => {
    refs.gallery.insertAdjacentHTML('beforeend', renderCard(cards));
  };

  const errorWatch = () => {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    refs.loadMoreBtn.style.display = 'none';
    refs.searchInput.value = '';
  };

  const renderCard = image => {
    return image
      .map(
        ({
          largeImageURL,
          webformatURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => ` <a class="photo__card" href="${largeImageURL}">
            <img
                class="gallery__img"
                src="${webformatURL}"
                alt="${tags}"
                loading="lazy"
            />
            <div class="info">
                <p class="info__item"><b>Likes </b>${likes}</p>
                <p class="info__item"><b>Views </b>${views}</p>
                <p class="info__item"><b>Comments </b>${comments}</p>
                <p class="info__item"><b>Downloads </b> ${downloads}</p>
            </div>
        </a>`,
      )
      .join('');
  };

  const cardsReset = () => {
    refs.gallery.innerHTML = '';
  };

  const firstTotalHits = totalHits => {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  };

  refs.searchForm.addEventListener('submit', onSearch);
  refs.loadMoreBtn.addEventListener('click', onLoadMore);
};
