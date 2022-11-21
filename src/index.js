
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import { fetchImages } from './js/fetchCountries';
import debounce from 'lodash.debounce';

import "simplelightbox/dist/simple-lightbox.min.css";
import './css/styles.css';

const gallerySimple = new SimpleLightbox('.gallery a', {
	captionDelay: 250
});

const options = {
    root: null,
    rootMargin: '250px',
    treshold: 1,
};

let observer = new IntersectionObserver(observerObj, options);


let pageNumber = 1;
let totalPage = 13;


const refs = {
    inputValue: document.querySelector('.search-form-input'),
    buttonEl: document.querySelector('.search-form-button'),
    renderEl: document.querySelector('.gallery'),
    sentryEl: document.querySelector('.sentry'),
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
                    if(data.totalHits < 500){
                        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.")
                    }
                    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
                }
            })
        }
    
}

function renderImages (image) {
    const images = image.map(images => 
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
    ).join('');
    
    
    refs.renderEl.insertAdjacentHTML('beforeend', images);
    
    observer.observe(refs.sentryEl)

    gallerySimple.refresh();
}

// window.addEventListener('scroll', () => {
//     const timmedValue = refs.inputValue.value.trim();
//     const documentRect = document.documentElement.getBoundingClientRect();

//     if (documentRect.bottom < document.documentElement.clientHeight + 150) {
//         pageNumber += 1;
//         fetchImages(timmedValue, pageNumber).then(data => {
//             if(data.totalHits < 500){
//                 Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
//             }
//             Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
//             renderImages(data.hits);
//         })
//     }
// },);

function observerObj (entries) {

    if (entries[0].intersectionRatio === 1 && pageNumber === totalPage) {
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        observer.unobserve(refs.sentryEl);
    }

    const timmedValue = refs.inputValue.value.trim();
    entries.forEach((e) => {
        if (e.isIntersecting) {
            pageNumber += 1;
            fetchImages(timmedValue, pageNumber).then(data => {
                console.log(pageNumber);
                renderImages(data.hits);
            })
        }
    })
}



function clearSearch () {
    refs.renderEl.innerHTML = "";
    pageNumber = 1;
};
