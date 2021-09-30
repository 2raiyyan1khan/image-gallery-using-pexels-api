class Gallery {
  constructor() {
    this.api_key = "563492ad6f91700001000001177e965ea4894c4ca53f5b6c03ebe161 ";
    this.baseUrl = "https://api.pexels.com/v1/curated?per_page=12&page=1";
    this.searchUrl = " https://api.pexels.com/v1/search?per_page=12&query=";
    this.galleryDiv = document.getElementById("gallery");
    this.load_more = document.getElementById("load-more-btn");
    this.form = document.getElementById("search-form");
    this.searchInput = document.getElementById("search-input");
    this.nextPage = "";
    this.loading = false;
    this.loadEvents();
  }
  loadEvents() {
    document.addEventListener("DOMContentLoaded", () => {
      this.getImages(this.baseUrl);
    });
    this.load_more.addEventListener("click", () => {
      this.loadMore();
    });
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.searchInput.value !== "") {
        this.searchImages(this.searchUrl + this.searchInput.value);
      }
    });
  }
  async getImages(url) {
    let data = await this.fetchImages(url);
    if (data) {
      this.loading = false;
      this.galleryDiv.innerHTML = "";
      this.insertDataInHtml(data);
    }
  }
  async fetchImages(url) {
    this.loading = true;
    if (this.loading === true) {
      this.galleryDiv.innerHTML = `<div class="loading"><p>Loading....</p></div>`;
    }
    let data = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: this.api_key,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch((err) => {
        this.loading = false;
        this.galleryDiv.innerHTML = `<div class="loading"><p>Oops! ${err.message}</p></div>`;
      });
    return data;
  }
  insertDataInHtml(data) {
    let { photos, next_page } = data;
    this.nextPage = next_page;
    photos.map((img) => {
      let div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
    <a href=${img.src.original} target="_blank"><img src=${img.src.medium} alt=${img.photographer} />
    </a>
    <span><a href=${img.photographer_url} target="_blank" class="photographer"> ${img.photographer}</a></span>
    `;
      this.galleryDiv.appendChild(div);
    });
  }
  loadMore() {
    this.getImages(this.nextPage);
  }
  searchImages(url) {
    this.galleryDiv.innerHTML = "";
    this.getImages(url);
  }
}

let obj = new Gallery();
