export default class ImageApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 40;
  }

  async getImage() {
    const response = await fetch(
      `https://pixabay.com/api/?key=24934127-a7ffa5e3ab8ae38d45e47e54e&q=${this.searchQuery}&image_type=photo$safesearch=true&orientation=horizontal&page=${this.page}&per_page=${this.perPage}`,
    );
    const newCard = await response.json();
    this.incrementPage();
    return newCard;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
