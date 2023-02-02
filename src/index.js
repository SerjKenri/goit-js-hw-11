import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import { fetchImages } from './js/fetchCountries';
import debounce from 'lodash.debounce';

import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

const gallerySimple = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
});

const refs = {
    inputValue: document.querySelector('.search-form-input'),
    buttonEl: document.querySelector('.search-form-button'),
    renderEl: document.querySelector('.gallery'),
    sentryEl: document.querySelector('.sentry'),
};

const options = {
    root: null,
    rootMargin: '150px',
    treshold: 1,
};

function observerObj(entries) {
    const timmedValue = refs.inputValue.value.trim();
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            observer.unobserve(entry.target);

            pageNumber++;

            if (entry.intersectionRatio === 1 && pageNumber === totalPage) {
                Notiflix.Notify.failure(
                    "We're sorry, but you've reached the end of search results."
                );
            }
            fetchImages(timmedValue, pageNumber).then(data => {
                renderImages(data.hits);
                const hasPhoto =
                    pageNumber < totalPage && data.totalHits === 500;
                if (hasPhoto) {
                    if (data.totalHits < 500) {
                        return;
                    }
                    observer.observe(refs.sentryEl);
                }
            });
        }
    });
}

const observer = new IntersectionObserver(observerObj, options);

let pageNumber = 1;
let totalPage = 13;

refs.buttonEl.addEventListener('click', searchPhoto);

function searchPhoto(evt) {
    evt.preventDefault();

    clearSearch();

    const timmedValue = refs.inputValue.value.trim();
    if (timmedValue !== '') {
        fetchImages(timmedValue, pageNumber).then(data => {
            if (data.totalHits === 0) {
                Notiflix.Notify.failure(
                    'Sorry, there are no images matching your search query. Please try again.'
                );
            } else {
                const lastEl = document.querySelector('.gallery:last-child');
                renderImages(data.hits);

                observer.observe(refs.sentryEl);
                Notiflix.Notify.success(
                    `Hooray! We found ${data.totalHits} images.`
                );
                if (data.totalHits < 500) {
                    Notiflix.Notify.failure(
                        "We're sorry, but you've reached the end of search results."
                    );
                }
            }
        });
    }
}

function renderImages(image) {
    const images = image
        .map(
            images =>
                `<div class="photo-card">
        <a href="${images.largeImageURL}"><img class="photo" src="${images.webformatURL}" alt="${images.tags}" title="${images.tags}" loading="lazy"/>
            <div class="info">
                <p class="info-item">
                <b>Likes: </b>${images.likes}
                </p>
                <p class="info-item">
                <b>Views: </b>${images.views}  
                </p>
                <p class="info-item">
                <b>Comments: </b>${images.comments}
                </p>
                <p class="info-item">
                <b>Downloads: </b>${images.downloads} 
                </p>
            </div>
        </div>
        </a>`
        )
        .join('');

    refs.renderEl.insertAdjacentHTML('beforeend', images);

    gallerySimple.refresh();
}

function clearSearch() {
    refs.renderEl.innerHTML = '';
    pageNumber = 1;
}
