
import Notiflix from 'notiflix';
import simpleLightbox from 'simplelightbox';
import { fetchImages } from './js/fetchCountries';
import debounce from 'lodash.debounce';

import "simplelightbox/dist/simple-lightbox.min.css";
import './css/styles.css';

const gallerySimple = new SimpleLightbox('.gallery a', {
	captionDelay: 250
});

let pageNumber = 1;

const refs = {
    inputValue: document.querySelector('.search-form-input'),
    buttonEl: document.querySelector('.search-form-button'),
    renderEl: document.querySelector('.gallery'),
};

refs.buttonEl.addEventListener('click', searchPhoto);

function searchPhoto (evt) {
        evt.preventDefault();

        clearSearch();
    
        const timmedValue = refs.inputValue.value.trim();
        if (timmedValue !== "") {
            fetchImages(timmedValue, pageNumber).then(data => {
                if (data.hits.length === 0) {
                    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                } else {
                    renderImages(data.hits);
                    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
                    // gallerySimple.refresh();
                }
            })
        }
    
}

function renderImages (image) {
    const images = image.map(images => {
        return `<div class="photo-card">
        <a href="${images.largeImageURL}"><img class="photo" src="${images.webformatURL}" alt="${images.tags}" title="${images.tags}" loading="lazy"/></a>
            <div class="info">
                <p class="info-item">
                <b>Likes</b>${images.likes}
                </p>
                <p class="info-item">
                <b>Views</b>${images.views}  
                </p>
                <p class="info-item">
                <b>Comments</b>${images.comments}
                </p>
                <p class="info-item">
                <b>Downloads</b>${images.downloads} 
                </p>
            </div>
        </div>`
    }).join('');

    refs.renderEl.insertAdjacentHTML('beforeend', images);
}

window.addEventListener('scroll', () => {
    const timmedValue = refs.inputValue.value.trim();
    const documentRect = document.documentElement.getBoundingClientRect();

    if (documentRect.bottom < document.documentElement.clientHeight + 300) {
        pageNumber += 1;
        fetchImages(timmedValue, pageNumber).then(data => {
            renderImages(data.hits);
            gallerySimple.refresh();
        })
    }
},);

function clearSearch () {
    refs.renderEl.innerHTML = "";
    pageNumber = 1;
};