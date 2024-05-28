// header script
let header = document.querySelector('header');
let search = document.getElementById('searchInput'); 
window.addEventListener('scroll', function() {
  let scrolled = window.scrollY > 20;
    header.style.backgroundColor = scrolled ? '#333333' : 'transparent';
    header.style.color = !scrolled ? 'grey' : '#FFFFFF';
    header.style.padding = scrolled ? '9px' : '15px';
    search.style.color = scrolled ? 'white' : '#fff';
});
function toggleMenu() {
  let menu = document.getElementById('menu');
  menu.classList.toggle('open');
}




// search script 
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
let searchTerm = '';
if (searchInput) {
  searchInput.addEventListener('input', function() {
    searchTerm = searchInput.value.toLowerCase();
    searchResults.innerHTML = '';
    if (searchTerm === '') {
      return;
    }
    fetch('database/database.json')
      .then(response => response.json())
      .then(data => {
        let hasResults = false;
        data.data.forEach(entry => {
          const entryTitle = entry.judul.toLowerCase();
          if (entryTitle.includes(searchTerm)) {
            const entryElement = document.createElement('li');
            const entryLink = document.createElement('a');
            entryLink.href = `blog-detail.html?id=${encodeURIComponent(entry.id)}`;
            entryLink.innerHTML = `<div class="blog-content">
            <div class="img-search">
            <img src="asset/${entry.id}.jpg"alt="" srcset="" >
            </div>
            <div class="content-blog">
            <p class="search-judul">${entry.judul}</p>     
            </div>
              </div>`;
            entryElement.classList.add('search-item');
            entryElement.appendChild(entryLink);
            searchResults.appendChild(entryElement);
            hasResults = true;
          }
        });

        if (!hasResults) {
          const noResultsElement = document.createElement('li');
          noResultsElement.textContent = 'Tidak ada hasil';
          searchResults.appendChild(noResultsElement);
        }
      })
      .catch(error => console.log(error));
  });
  searchInput.addEventListener('blur', function() {
    setTimeout(() => {
      searchResults.innerHTML = '';
    }, 200);
  });
  searchInput.addEventListener('focus', function() {
    if (searchTerm) {
      fetch('database/database.json')
        .then(response => response.json())
        .then(data => {
          let hasResults = false;
          data.data.forEach(entry => {
            const entryTitle = entry.judul.toLowerCase();
            if (entryTitle.includes(searchTerm)) {
              const entryElement = document.createElement('li');
              const entryLink = document.createElement('a');
              entryLink.href = `blog-detail.html?id=${encodeURIComponent(entry.id)}`;
              entryLink.innerHTML = `<div class="blog-content blog-search">
              <div class="img-search">
              <img src="asset/${entry.id}.jpg" width="100" height="100 alt="" srcset="" >
              </div>
              <div class="content-blog">
                <p class="search-judul"">${entry.judul}</p>     
                </div>
                </div>`;
              entryElement.classList.add('search-item');
              entryElement.appendChild(entryLink);
              searchResults.appendChild(entryElement);
              hasResults = true;
            }
          });

          if (!hasResults) {
            const noResultsElement = document.createElement('li');
            noResultsElement.textContent = 'Tidak ada hasil';
            searchResults.appendChild(noResultsElement);
          }
        })
        .catch(error => console.log(error));
    }
  });
}




// timestamp function
function getRelativeTime(timestamp) {
  const currentDate = new Date();
  const targetDate = new Date(timestamp);
  const diffInMilliseconds = currentDate - targetDate;
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays > 0) {
    return `${diffInDays} hari yang lalu`;
  } else if (diffInHours > 0) {
    return `${diffInHours} jam yang lalu`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} menit yang lalu`;
  } else {
    return `${diffInSeconds} detik yang lalu`;
  }
}




// script kategori
function showDataByCategory() {
const currentURL = new URL(window.location.href);
const params = new URLSearchParams(currentURL.search);
const kategori = params.get('kategori');
const dataContainer = document.getElementById('blog');
dataContainer.innerHTML = '';
  fetch('database/database.json')
  .then(response => response.json())
  .then(data => {
    data.data.forEach(entry => {
      if (!kategori|| entry.kategori == kategori) {
        const entryElement = document.createElement('div');
        const targetDate = new Date(entry.tanggal);
        const timestamp = targetDate.getTime();
        let id = entry.id;
        let img = id.toString();
        let tgl = getRelativeTime(timestamp);
        entryElement.classList.add('blog-item');
        const screenWidth = window.innerWidth;
        let longText ;
        if (screenWidth <= 720) {
          longText = 15;
        } else {
          longText = 30;
          }
        entryElement.innerHTML = `
        <div class="judul">
        <h3 class="blog-title">
        <a href="blog-detail.html?id=${encodeURIComponent(entry.id)}">${entry.judul}</a>
        </h3>
        </div>
        <div class="blog-content">
        <div class="img-blog">
        <img src="asset/${entry.id}.jpg" alt="" srcset="" >
        </div>
        <div class="content-blog">
        <div class="keterangan">
        <span class="kategori ${entry.kategori}">${entry.kategori}</span>
        
        </div>
          <p class="description">${truncateText(entry.isi, longText)}...<a class="read-more" href="blog-detail.html?id=${encodeURIComponent(entry.id)}">Read More</a></p>
          </div>  
          
          </div>
          
          <div class="tanggal tgl">${tgl}</div>
        `;
        dataContainer.appendChild(entryElement);
      }
    });

    initializePagination();

  })
  .catch(error => console.log(error));
}



// split text
function truncateText(text, maxLength) {
  const words = text.trim().split(/\s+/);
  
  if (words.length <= maxLength) {
    return text;
  } else {
    const truncatedWords = words.slice(0, maxLength);
    const truncatedText = truncatedWords.join(' ');
    return truncatedText + '...';
  }
}



// script pagination
function initializePagination() {
  let numberOfItems = document.querySelectorAll("#blog .blog-item").length;
  let limitPerPage = 5;
  let totalPages = Math.ceil(numberOfItems / limitPerPage);
  let paginationSize = 7;
  let currentPage = 1;
  function getPageList(totalPages, page, maxLength) {
    function range(start, end) {
      return Array.from({ length: end - start + 1 }, (_, i) => i + start);
    }

    let sideWidth = maxLength < 9 ? 1 : 2;
    let leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
    let rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;

    if (totalPages <= maxLength) {
      return range(1, totalPages);
    }
    if (page <= maxLength - sideWidth - 1 - rightWidth) {
      return range(1, maxLength - sideWidth - 1).concat(0, range(totalPages - sideWidth + 1, totalPages));
    }
    if (page >= totalPages - sideWidth - 1 - rightWidth) {
      return range(1, sideWidth).concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
    }
    return range(1, sideWidth).concat(0, range(page - leftWidth, page + rightWidth), 0, range(totalPages - sideWidth + 1, totalPages));
  }

  function showPage(whichPage) {
    if (whichPage < 1 || whichPage > totalPages)
      return false;
    currentPage = whichPage;
    let blogItems = document.querySelectorAll("#blog .blog-item");
    blogItems.forEach(function(item, index) {
      if (index >= (currentPage - 1) * limitPerPage && index < currentPage * limitPerPage) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
    let pageNumbers = document.querySelectorAll(".page-numbers li");
    pageNumbers.forEach(function(item, index) {
      if (index > 0 && index < pageNumbers.length - 1) {
        item.parentNode.removeChild(item);
      }
    });
    getPageList(totalPages, currentPage, paginationSize).forEach(function(item) {
      let li = document.createElement("li");
      li.className = "page-item";
      li.classList.add(item ? "current-page" : "dots");
      if (item === currentPage) {
        li.classList.add("active");
      }
      let a = document.createElement("a");
      a.className = "page-link";
      a.href = "javascript:void(0)";
      a.textContent = item || "...";
      li.appendChild(a);
      document.querySelector(".next-page").parentNode.insertBefore(li, document.querySelector(".next-page"));
    });
    let previousPage = document.querySelector(".previous-page");
    let nextPage = document.querySelector(".next-page");
    previousPage.classList.toggle("disable", currentPage === 1);
    nextPage.classList.toggle("disable", currentPage === totalPages);
    let pageLinks = document.querySelectorAll(".pagination li.current-page:not(.active)");
    pageLinks.forEach(function(link) {
      link.addEventListener("click", function() {
        showPage(Number(link.textContent));
      });
    });

    return true;
  }
  let previousPageBtn = document.querySelector(".previous-page");
  previousPageBtn.addEventListener("click", function() {
    showPage(currentPage - 1);
  });

  let nextPageBtn = document.querySelector(".next-page");
  nextPageBtn.addEventListener("click", function() {
    showPage(currentPage + 1);
  });

  document.querySelector(".row").style.display = "block";
  showPage(1);
}




// script detail-blog
const currentURL = new URL(window.location.href);
const params = new URLSearchParams(currentURL.search);
const id = params.get('id');
let detailBlog = document.querySelector(".detail-blog");
fetch('database/database.json')
.then(response => response.json())
.then(data => {
  data.data.forEach(entry => {
    if (entry.id == id) {
      const entryElement = document.createElement('div');
      entryElement.classList.add('detail-item');
      const targetDate = new Date(entry.tanggal);
        const timestamp = targetDate.getTime(); // Mengambil timestamp dalam milidetik
        function getRelativeTime(timestamp) {
          const currentDate = new Date();
          const targetDate = new Date(timestamp);
        
          const diffInMilliseconds = currentDate - targetDate;
          const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
          const diffInMinutes = Math.floor(diffInSeconds / 60);
          const diffInHours = Math.floor(diffInMinutes / 60);
          const diffInDays = Math.floor(diffInHours / 24);
        
          if (diffInDays > 0) {
            return `${diffInDays} hari yang lalu`;
          } else if (diffInHours > 0) {
            return `${diffInHours} jam yang lalu`;
          } else if (diffInMinutes > 0) {
            return `${diffInMinutes} menit yang lalu`;
          } else {
            return `${diffInSeconds} detik yang lalu`;
          }
        }
        let tgl = getRelativeTime(timestamp);
      entryElement.innerHTML = `
      <div class="content-blog">
      <h3 class="blog-judul">${entry.judul}</h3>
        <div class="image">
        <img src="asset/${entry.id}.jpg" alt="" srcset="" >
        </div>
        <div class="ket">
        <span class="penulis">${entry.penulis}</span>
        <span class="kategori ${entry.kategori}">${entry.kategori}</span>
        </div>
       
        <p class="isi">${checkLetter(entry.isi)}</p>
        <div class="tanggal">${tgl}</div>
        </div>
    
      `;
      detailBlog.appendChild(entryElement);
    }
  });
});

// script style isi
function checkLetter(text) {
  let result = '';
  let tagOpen = '';
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '|') {
      result += '<br><br>';
    }
    else if (text[i] === '~') {
      if (tagOpen === '<b>') {
        result += '</b>';
        tagOpen = '';
      } else {
        result += '<b>';
        tagOpen = '<b>';
      }
    }
    else {
      result += text[i];
    }
  }
  if (tagOpen === '<b>') {
    result += '</b>';
  }
  return result;
}


// loading
window.addEventListener('load', function() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  setTimeout(function() {
    loadingOverlay.style.display = 'none';
  }, 500); // Mengatur waktu tunda 2 detik (2000 milidetik)
});

// script latest
let latest = document.querySelector(".latest");
fetch('database/database.json')
  .then(response => response.json())
  .then(data => {
    function truncateText(text, maxLength) {
      const words = text.trim().split(/\s+/);
      if (words.length <= maxLength) {
        return text;
      } else {
        const truncatedWords = words.slice(0, maxLength);
        const truncatedText = truncatedWords.join(' ');
        return truncatedText + '...';
      }
    }
    let count = 0;
    let a = 8;
    data.data.forEach(entry => {
      if (count >= a) return;
      const entryElement = document.createElement('div');
      entryElement.classList.add('list-latest');
      entryElement.innerHTML = `
        <div class="image-latest">
          <img src="asset/${entry.id}.jpg" alt="" srcset="" >
        </div>
        <h3 class="latest-judul">
          <a href="blog-detail.html?id=${encodeURIComponent(entry.id)}">${truncateText(entry.judul, 5)}</a>
        </h3>
      `;
      latest.appendChild(entryElement);
      count++;
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
      return showDataByCategory('all');
  });