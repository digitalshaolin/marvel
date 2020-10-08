let covers1;
let covers2;
const yearSelect = document.querySelector('.select');
const yearSelect2 = document.querySelector('.select2');
let year = yearSelect.value;
let year2 = yearSelect2.value;
const targetDiv1 = document.querySelector('.images-wrap1');
const targetDiv2 = document.querySelector('.images-wrap2');
const yearLabel1 = document.querySelector('.year-label1');
const yearLabel2 = document.querySelector('.year-label2');
const form = document.querySelector('.form');
const loaderDiv = document.querySelector('.loader');
const imageClickText = document.querySelector('.click-images__text')

form.addEventListener('submit', function (e) {    
    e.preventDefault();    
    clearPreviousCovers();    
    year = yearSelect.value;
    year2 = yearSelect2.value;
    yearLabel1.innerHTML = `${year}`;
    yearLabel2.innerHTML = `${year2}`;
    imageClickText.innerHTML = 'Click images for more details';
    imageClickText.classList.add('slideDelayed');
    yearLabel1.classList.add('slide');
    yearLabel2.classList.add('slide');
    setTimeout(() => {
        yearLabel1.classList.remove('slide');
        yearLabel2.classList.remove('slide');
        imageClickText.classList.remove('slideDelayed');
    }, 2000);
    getAllCovers();    
});

function clearPreviousCovers() {
    targetDiv1.innerHTML = '';
    targetDiv2.innerHTML = '';
    yearLabel1.innerHTML = '';
    yearLabel2.innerHTML = '';
}



function renderDOM(imageData, targetDiv) {
    let counter = 0; 
    let newHTML = "";
    imageData.forEach(el => {
        if (el.images[0] && counter < 4) {
            let image = el.images[0].path;
            let id = el.id;
            newHTML += `<img class="image" data-id=${id} src=${image}.jpg>`;            
            counter++;
        }
    });
    targetDiv.innerHTML = newHTML;
}

function getFirstCovers() {
    return axios.get('http://gateway.marvel.com/v1/public/comics', {
        params: {
            apikey: '6ae0f990493de33fbd6f702286834934',
            hash: '03663d995f0c0cf012ec92e748bf3ff8',
            ts: '1589263037123',
            dateRange: `${year}-01-01,${parseInt(year) + 1}-01-01`,
            limit: '6'
        }
    });
}

function getSecondCovers() {
    return axios.get('http://gateway.marvel.com/v1/public/comics', {
        params: {
            apikey: '6ae0f990493de33fbd6f702286834934',
            hash: '03663d995f0c0cf012ec92e748bf3ff8',
            ts: '1589263037123',
            dateRange: `${year2}-01-01,${parseInt(year2) + 1}-01-01`,
            limit: '6'            
        }
    });
}

function getAllCovers() {
    axios.all([getFirstCovers(), getSecondCovers()])
        .then(axios.spread(function (firstCovers, secondCovers) {
            covers1 = firstCovers.data.data.results;
            covers2 = secondCovers.data.data.results;
            renderDOM(covers1, targetDiv1);
            renderDOM(covers2, targetDiv2);
            addModalData(covers1, covers2);           
        }))
        .catch(function (error) {
            console.log(error);
        });
}

function addModalData(results, results2) {
    const allCoverArt = document.querySelectorAll('.image');
    const modal = document.querySelector('.modal');
    const title = document.querySelector('.title');
    const writer = document.querySelector('.writer');
    const penciler = document.querySelector('.penciler');
    const colorist = document.querySelector('.colorist');
    const modalImage = document.querySelector('.modal-image');
    const description = document.querySelector('.description');
    const modalSand = document.querySelector('.modal-sandbox');
    const closeButton = document.querySelector('.close-modal-btn');

    modalSand.addEventListener('click', function () {
        modal.style.display = 'none';
        let creatorP = document.querySelectorAll('.remove-p');
        creatorP.forEach(el => {
            el.remove();
        });
    });

    closeButton.addEventListener('click', function () {
        modal.style.display = 'none';
        let creatorP = document.querySelectorAll('.remove-p');
        creatorP.forEach(el => {
            el.remove();
        });
    });

    allCoverArt.forEach(el => {
        el.addEventListener('click', function (e) {
            let id = e.target.attributes[1].value;
            let image = e.target.currentSrc;
            const mergedResults = results.concat(results2);
            console.log(mergedResults);
          

            mergedResults.forEach(el => {
                let creatorsArray = el.creators.items;

                if (el.id == id) {
                    let creatorsSection = document.querySelector('.creators');
                    title.innerText = el.title;
                    modalImage.src = image;
                    description.innerText = el.description;

                    // Loop through the creators array of the selected comic to display creators in modal /////////////////

                    creatorsArray.forEach(el => {
                        let p = document.createElement('p');
                        creatorsSection.appendChild(p);
                        p.classList.add('remove-p');
                        p.innerText = `${el.name} - ${el.role}`;                       
                    });
                    modal.style.display = 'block';                    
                }
            });
            
        });
    });
}






