/*
  Web Design II
  Projeto
  JavaScript
  António Castro, nº 201206754
  Beatriz Teixeira, nº 201905983
  Bruno Barros, nº 201909069
*/

// Initializing variables

let datearray = [];
let idarray = [];
let yeararray = [];
let myYear;
let dadosindividual;
let randomnumber;
let dadorandom;
let categories;
let changes;
let ultimo;
let altr;
let target;
let grabit;
let grabit2;

// DOM Event Listener waits for content on the page
addEventListener("load", init);

function init() {
  getSome();
}

function getSome() {
  // JSON url endpoint (filtering by last 15, adaptable)
  let url =
    "https://nit.fba.up.pt/dev/wp-json/wp/v2/posts?categories=13&per_page=15";

  // Initializing fetch operation
  fetch(url)
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (dados) {
      // Loop to get every post, calling a new function on every WordPress entry
      for (let post of dados) {
        buildPost(post);
      }

      // Second loop to change the posts' category names
      for (let post of dados) {
        fetchCategory(post.categories[0]);
      }

      // Third loop to change the posts' images
      for (let post of dados) {
        fetchFeaturedMedia(post.id, post.featured_media);
      }

      // Run a specific entry of the loop (the last updated article on the WordPress page), creating its function

      dadosindividual = dados[0];
      buscarmediaultimo(dadosindividual.id, dadosindividual.featured_media);
      ultimoart(dadosindividual);

      // Run a random entry of the loop (excluding the last updated, with the "randomnumber" variable, to avoid repetion within the page), creating its function

      randomnumber = Math.floor(Math.random() * (dados.length - 1) + 1);
      dadorandom = dados[randomnumber];
      buscarmediarandom(dadorandom.id, dadorandom.featured_media);
      randomart(dadorandom);
    })

    // Fallback to know if something went wrong within the three fetch operation
    .catch(function (error) {
      console.log(error);
    });
}

// Building the actual post, creating elements with information from JSON (ID, year, category, excerpt - which is sliced to fit the thumbnail chosen size)

function buildPost(_post) {
  let el = document.createElement("div");
  let el2 = document.createElement("a");
  let el3 = document.createElement("div");
  let myID = "id-" + _post.id;
  myYear = _post.acf.data;
  categories = _post.categories[0];
  let excerpt = _post.excerpt.rendered;
  let excerpt_slice = excerpt.slice(0, 100) + "...";

  // The arrays responsbile for the timeline interaction are also called in this function, in order to get every relevant JSON data

  datearray.push(myYear + "d" + categories + "t" + myID);
  idarray.push(myYear + " d" + categories);
  yeararray.push(myYear);

  el.setAttribute("amount", myYear);
  el.setAttribute("id", myID);
  el.setAttribute("class", "articlecontent " + "b" + categories);

  el2.setAttribute("class", "lists");
  el2.setAttribute("class", "b" + categories);
  el2.setAttribute("href", "#" + myID);

  el3.setAttribute("class", "allrandom changemeplease");

  el3.setAttribute(
    "id",
    "timeline_view" + "p" + myYear + "d" + categories + "t" + myID
  );

  // Creating template literals to build the inner HTML of the actual post, the list present on the left side of the archive, and its preview, which sits on top of the timeline page

  el.innerHTML = `      <figure class="thumbnail">
  <img src="">
  <figcaption>Caption of image</figcaption>
  </figure>             <div class="fullh1">
                        <h1>${_post.title.rendered}</h1>
                        </div>
                        <div class="fullh1span">
                        <span class="artyear">${_post.acf.data}</span>
                        <span class="local"> ${_post.acf.local}</span>
                        <span class="artcat c${_post.categories[0]}"</span>
                        </div>
                        <div class="allpadding">
                        <p>${_post.content.rendered}</p>
                        </div>`;

  el2.innerHTML = `     <div class="listspan">
                        <span class="listyear">${_post.acf.data}</span>
                        <span class="listelement">${_post.title.rendered}</span>
                        <span class="listcategory">${_post.acf.local}</span>
                        </div>`;

  el3.innerHTML = `  
                      <img id="idimg-${
                        _post.featured_media
                      }" src="waiting… ${getThumbnail(_post.featured_media)}">
                      <div id = "id2-" + ${_post.id}" class="randomtext">
                      
                        <p class="destaques">EM DESTAQUE</p>
                        <h1>${_post.title.rendered}</h1>
                        <span class="artyear2">${_post.acf.data}</span>
                        <span class="local2"> ${_post.acf.local}</span>
                        <span class="artcat2 c${_post.categories[0]}"></span>
                        ${excerpt_slice}<span class="plus2"><a href="#${myID}">+</a></span>
                      </div>`;

  document.querySelector(".feedarticle").appendChild(el);
  document.querySelector(".nav").appendChild(el2);
  document.querySelector(".right").appendChild(el3);
}

// Function to fetch the thumbnails from every article, setting the source attribute to every preview article
function getThumbnail(_thumbID) {
  let url = "https://nit.fba.up.pt/dev/wp-json/wp/v2/media/";
  url += _thumbID;

  let imgurl = "";
  fetch(url)
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (dados) {
      imgurl = dados.media_details.sizes.thumbnail.source_url;
      let t = "#idimg-" + _thumbID;
      document.querySelector(t).setAttribute("src", imgurl);
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Building the last updated post (singular action), creating elements with information from JSON (ID, year, category, excerpt - which is sliced to fit the thumbnail chosen size)

function ultimoart(_artigoindividual) {
  ultimo = document.createElement("div");
  let meuID = "id-" + _artigoindividual.id;
  let athumbnail = _artigoindividual.featured_media;
  let excerpt = _artigoindividual.excerpt.rendered;
  let excerpt_slice = excerpt.slice(0, 100) + "...";

  ultimo.setAttribute("class", "c_" + athumbnail);
  ultimo.setAttribute("class", "last");

  ultimo.innerHTML = `
   <div class="lasttext">
   <p class="destaques">ÚLTIMO ARTIGO</p>
   <h1>${_artigoindividual.title.rendered}</h1>
   <span class="artyear2">${_artigoindividual.acf.data}</span>
                        <span class="local2"> ${_artigoindividual.acf.local}</span>
                        <span class="artcat2 c${_artigoindividual.categories[0]}"></span>
   ${excerpt_slice}<span class="plus2"><a href="#${meuID}">+</a></span>
   </div>
   `;

  document.querySelector(".left").appendChild(ultimo);
}

// Building a random post (on each page's refresh, a different article pops up; singular action), which is creating elements with information from JSON (ID, year, category, excerpt - which is sliced to fit the thumbnail chosen size)

function randomart(_artigorandom) {
  altr = document.createElement("div");
  let meuID = "id-" + _artigorandom.id;
  let athumbnail = _artigorandom.featured_media;
  let excerpt = _artigorandom.excerpt.rendered;
  let excerpt_slice = excerpt.slice(0, 100) + "...";

  altr.setAttribute("class", "c_" + athumbnail);
  altr.setAttribute("class", "changemeplease firstrandomized");

  altr.innerHTML = `
  <div class="randomtext">
  <p  class="destaques">EM DESTAQUE</p>
  <h1>${_artigorandom.title.rendered}</h1>
  <span class="artyear2">${_artigorandom.acf.data}</span>
                        <span class="local2"> ${_artigorandom.acf.local}</span>
                        <span class="artcat2 c${_artigorandom.categories[0]}"></span>
                        ${excerpt_slice}<span class="plus2"><a href="#${meuID}">+</a></span>
  </div>`;

  document.querySelector(".right").appendChild(altr);
}

// Function to fetch categories numbers
function fetchCategory(_cat_num) {
  let category_name = "";

  let url = "https://nit.fba.up.pt/dev/wp-json/wp/v2/categories/";

  // Adding the category number to the main URL

  url += _cat_num;

  fetch(url)
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (dados) {
      let myClass = ".c" + _cat_num;
      let els = document.querySelectorAll(myClass);

      // Changing every article created in the build post function to its own category, later used in filtering actions
      for (let el of els) {
        el.innerHTML = dados.name;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Asynchronous function (elements are only processed and generated after every other thing has loaded within the DOM)

async function fetchFeaturedMedia(_id, _media) {
  let url = "https://nit.fba.up.pt/dev/wp-json/wp/v2/media/";
  url += _media;

  let mySrc = "";

  // All of the code "halts and waits" for this before proceeeding
  const resposta = await fetch(url);

  // Checking for possible errors
  if (!resposta.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // if a promise is sent, get the data "after waiting for it to arrive" into a new JSON variable/object
  const dados = await resposta.json();

  fonte = dados.media_details.sizes.thumbnail.source_url;

  // Get the article > figure > img and set the source (src)
  let myID = "#id-" + _id;
  let myEl = document.querySelector(myID);
  myEl.children.item(0).children.item(0).setAttribute("src", fonte);

  // "Ready" function allow for the scripts to iniatialize only when the document has fully loaded up

  $(document).ready(function () {
    resetnotexto();
    filtros();
    ajustartimeline();
  });

  // Timeline adjustments, such as button behavior, "back" options and decade filtering within each century

  function ajustartimeline() {
    $(".z1700, .z1800, .z1900, .z2000").addClass("newbeginnings");

    // Century button adjusts and filters the timeline

    $(".box_1 .ano_display").click(function () {
      if (
        $(".box_1").css("display") !== "none" &&
        $(".box_2").css("display") !== "none" &&
        $(".box_3").css("display") !== "none" &&
        $(".box_4").css("display") !== "none"
      ) {
        $(".ano_display").addClass("seemorebutts");
        $(".stylecss").addClass("zoomborder");
        $(".decade").removeClass("decadeinactive");
        $(".close").removeClass("closeinactive");
        $(".box_2").css("display", "none");
        $(".box_3").css("display", "none");
        $(".box_4").css("display", "none");
      } else if (
        $(".box_1").css("display") !== "none" &&
        $(".box_2").css("display") == "none" &&
        $(".box_3").css("display") == "none" &&
        $(".box_4").css("display") == "none"
      ) {
        $(".ano_display").removeClass("seemorebutts");
        $(".stylecss").removeClass("zoomborder");
        $(".decade").addClass("decadeinactive");
        $(".close").addClass("closeinactive");
        $(".box_2").css("display", "block");
        $(".box_3").css("display", "block");
        $(".box_4").css("display", "block");
      }
    });

    $(".box_2 .ano_display").click(function () {
      if (
        $(".box_1").css("display") !== "none" &&
        $(".box_2").css("display") !== "none" &&
        $(".box_3").css("display") !== "none" &&
        $(".box_4").css("display") !== "none"
      ) {
        $(".ano_display").addClass("seemorebutts");
        $(".stylecss").addClass("zoomborder");
        $(".decade").removeClass("decadeinactive");
        $(".close").removeClass("closeinactive");
        $(".box_1").css("display", "none");
        $(".box_3").css("display", "none");
        $(".box_4").css("display", "none");
      } else if (
        $(".box_1").css("display") == "none" &&
        $(".box_2").css("display") !== "none" &&
        $(".box_3").css("display") == "none" &&
        $(".box_4").css("display") == "none"
      ) {
        $(".ano_display").removeClass("seemorebutts");
        $(".stylecss").removeClass("zoomborder");
        $(".decade").addClass("decadeinactive");
        $(".close").addClass("closeinactive");
        $(".box_1").css("display", "block");
        $(".box_3").css("display", "block");
        $(".box_4").css("display", "block");
      }
    });

    $(".box_3 .ano_display").click(function () {
      if (
        $(".box_1").css("display") !== "none" &&
        $(".box_2").css("display") !== "none" &&
        $(".box_3").css("display") !== "none" &&
        $(".box_4").css("display") !== "none"
      ) {
        $(".ano_display").addClass("seemorebutts");
        $(".stylecss").addClass("zoomborder");
        $(".decade").removeClass("decadeinactive");
        $(".close").removeClass("closeinactive");
        $(".box_1").css("display", "none");
        $(".box_2").css("display", "none");
        $(".box_4").css("display", "none");
      } else if (
        $(".box_1").css("display") == "none" &&
        $(".box_2").css("display") == "none" &&
        $(".box_3").css("display") !== "none" &&
        $(".box_4").css("display") == "none"
      ) {
        $(".ano_display").removeClass("seemorebutts");
        $(".stylecss").removeClass("zoomborder");
        $(".decade").addClass("decadeinactive");
        $(".close").addClass("closeinactive");
        $(".box_1").css("display", "block");
        $(".box_2").css("display", "block");
        $(".box_4").css("display", "block");
      }
    });
    $(".box_4 .ano_display").click(function () {
      if (
        $(".box_1").css("display") !== "none" &&
        $(".box_2").css("display") !== "none" &&
        $(".box_3").css("display") !== "none" &&
        $(".box_4").css("display") !== "none"
      ) {
        $(".ano_display").addClass("seemorebutts");
        $(".stylecss").addClass("zoomborder");
        $(".decade").removeClass("decadeinactive");
        $(".close").removeClass("closeinactive");
        $(".box_1").css("display", "none");
        $(".box_2").css("display", "none");
        $(".box_3").css("display", "none");
      } else if (
        $(".box_1").css("display") == "none" &&
        $(".box_2").css("display") == "none" &&
        $(".box_3").css("display") == "none" &&
        $(".box_4").css("display") !== "none"
      ) {
        $(".ano_display").removeClass("seemorebutts");
        $(".stylecss").removeClass("zoomborder");
        $(".decade").addClass("decadeinactive");
        $(".close").addClass("closeinactive");
        $(".box_1").css("display", "block");
        $(".box_2").css("display", "block");
        $(".box_3").css("display", "block");
      }
    });

    // Back arrow allows for user to understand possibility of returning to full timeline view

    $(".close").click(function () {
      $(".box_1").css("display", "block");
      $(".box_2").css("display", "block");
      $(".box_3").css("display", "block");
      $(".box_4").css("display", "block");
      $(".ano_display").removeClass("seemorebutts");
      $(".stylecss").removeClass("zoomborder");
      $(".decade").addClass("decadeinactive");
      $(".close").addClass("closeinactive");
    });
  }

  // Other filtering actions

  function filtros() {
    // Timeline individual click (on every bubble) allows for the user to see a change in the prewiew on the top right, while hovering through the balls reveal the exact year of the article's content
    $(".clickmeplease").click(function () {
      $(this).addClass("clickedyear");
      $(".clickmeplease").not(this).removeClass("clickedyear");
      grabit = $(this).attr("href");
      $(".changemeplease" + grabit)
        .removeClass("allrandom")
        .addClass("randomized");
      $(".changemeplease")
        .not(".changemeplease" + grabit)
        .addClass("allrandom")
        .removeClass("randomized")
        .removeClass("firstrandomized");
    });

    $(".clickmeplease").mouseenter(function () {
      $(this).find("p").removeClass("pyearinactive");
    });

    $(".clickmeplease").mouseleave(function () {
      $(this).find("p").addClass("pyearinactive");
    });

    // Filter button ("Pessoas", "Locais", "Artefactos") and its behavior, such as temporarily hiding articles that don't belong to the clicked filter, highlighting the button (light a switch), and allowing for a reset by switching buttons

    $(".btn1").click(function () {
      $(".feedarticle, .nav").each(function () {
        if (
          $(this).find(".b14, .b37").css("display") == "none" &&
          $(this).find(".b52").css("display") !== "none"
        ) {
          $(this).find(".b14, .b37").show();
          $(".d14, .d37").removeClass("not-visible");
        } else if ($(".d52").hasClass("not-visible")) {
          $(".d52").removeClass("not-visible");
          $(this).find(".b52").show();
          $(".d14, .d37").addClass("not-visible");
        } else if (
          $(this).find(".b52").css("display") == "none" &&
          ($(this).find(".b37").css("display") !== "none" ||
            $(this).find(".b14").css("display") !== "none")
        ) {
          $(this).find(".b52").show();
          $(".b14, .b37").hide();
        } else {
          $(this).find(".b52").show();
          $(this).find(".b14, .b37").hide();
          $(".d14, .d37").addClass("not-visible");
        }
      });
    });

    $(".btn2").click(function () {
      $(".feedarticle, .nav").each(function () {
        if (
          $(this).find(".b52, .b37").css("display") == "none" &&
          $(this).find(".b14").css("display") !== "none"
        ) {
          $(this).find(".b52, .b37").show();
          $(".d52, .d37").removeClass("not-visible");
        } else if ($(".d14").hasClass("not-visible")) {
          $(".d14").removeClass("not-visible");
          $(this).find(".b14").show();
          $(".d52, .d37").addClass("not-visible");
        } else if (
          $(this).find(".b14").css("display") == "none" &&
          ($(this).find(".b52").css("display") !== "none" ||
            $(this).find(".b37").css("display") !== "none")
        ) {
          $(this).find(".b14").show();
          $(".b37, .b52").hide();
        } else {
          $(this).find(".b14").show();
          $(this).find(".b52, .b37").hide();
          $(".d52, .d37").addClass("not-visible");
        }
      });
    });

    $(".btn3").click(function () {
      $(".feedarticle, .nav").each(function () {
        if (
          $(this).find(".b14, .b52").css("display") == "none" &&
          $(this).find(".b37").css("display") !== "none"
        ) {
          $(this).find(".b14, .b52").show();
          $(".d14, .d52").removeClass("not-visible");
        } else if ($(".d37").hasClass("not-visible")) {
          $(".d37").removeClass("not-visible");
          $(this).find(".b37").show();
          $(".d14, .d52").addClass("not-visible");
        } else if (
          $(this).find(".b37").css("display") == "none" &&
          ($(this).find(".b52").css("display") !== "none" ||
            $(this).find(".b14").css("display") !== "none")
        ) {
          $(this).find(".b37").show();
          $(".b14, .b52").hide();
        } else {
          $(this).find(".b37").show();
          $(this).find(".b14, .b52").hide();
          $(".d14, .d52").addClass("not-visible");
        }
      });
    });
  }

  //ParseInt function allows comparison between article dates, filtering them in ascending order (from oldest to newest, chronologically), appending the results in the archive section

  $(".nav").each(function () {
    $(this)
      .children()
      .sort(function (a, b) {
        let first = parseInt($(a).text());
        let second = parseInt($(b).text());
        return first > second ? 1 : -1;
      })
      .appendTo($(".nav"));
  });

  $(".feedarticle").each(function () {
    $(this)
      .children()
      .sort(function (a, b) {
        let firstamount = parseInt($(a).attr("amount"));
        let secondamount = parseInt($(b).attr("amount"));
        return firstamount > secondamount ? 1 : -1;
      })
      .appendTo($(".feedarticle"));
  });

  // In the archive section, every time you click a list element on the left, it stays highlighted; when you enter on the article on the right, it changes the hightlight on the left based on your scroll (fallback: mouseenter)

  $(".nav a").click(function (index) {
    $(this).addClass("clicked");
    $(".nav a").not(this).removeClass("clicked");
  });

  $(".articlecontent").mouseenter(function () {
    $('.nav a[href="#' + $(this).attr("id") + '"]').each(function () {
      $(this).addClass("clicked");
      $(".nav a").not(this).removeClass("clicked");
    });
  });

  $(".articlecontent").mouseleave(function () {
    $('.nav a[href="#' + $(this).attr("id") + '"]').each(function () {
      $(this).removeClass("clicked");
    });
  });

  // Basic shift of the buttons, allowing for a "switch" behavior, like a toggle

  $(".bordered").click(function () {
    $(this).toggleClass("active");
    $(".bordered").not(this).removeClass("active");
  });

  // Allow for click on the last section (about) to scroll directly to the timeline

  $(".gotop").click(function () {
    $("#logotaggat").get(0).scrollIntoView();
  });

  $(".entry").click(function () {
    $("#logotaggat").get(0).scrollIntoView();
  });
}

// Timeline creation function

function resetnotexto(_morearticles) {
  datearray.sort();
  idarray.sort();
  yeararray.sort();

  // Century division

  for (let i = 1700; i < 2100; i += 100) {
    let anos = i;
    let addliartigo = document.querySelector(".decada" + anos);
    addliartigo.innerHTML = `
    <ul class="ano_box novo${anos}">
    </ul>`;

    // Decade division within each century

    for (let a = 0; a < 100; a += 10) {
      let cDecade = anos + a;
      alvo = document.querySelector(".novo" + anos);
      let elemento = document.createElement("li");
      novoclass = "a" + cDecade;
      elemento.setAttribute("class", novoclass + " stylecss");
      alvo.appendChild(elemento);

      // Appeding (as small bubbles) the articles that exist in the JSON to the timeline, based on their year

      for (let k = 0; k < datearray.length; k++) {
        let di = parseInt(datearray[k]);
        if (di >= cDecade && di < cDecade + 10) {
          target = document.querySelector(".a" + cDecade);
          let myEl2 = document.createElement("p");
          let myEl = document.createElement("li");
          let myEl4 = document.createElement("img");
          myEl2.innerHTML = yeararray[k];
          myEl2.setAttribute("class", "pyear pyearinactive");
          myEl.setAttribute("class", "clickmeplease" + " " + idarray[k]);
          myEl.setAttribute("href", "#timeline_view" + "p" + datearray[k]);
          myEl4.setAttribute("src", "img/circle.svg");
          target.appendChild(myEl);
          myEl.appendChild(myEl2);
          let myEl3 = document.createElement("p");
          myEl3.innerHTML = cDecade;
          myEl3.setAttribute("class", "decade decadeinactive" + " z" + cDecade);
          elemento.appendChild(myEl3);
          myEl.appendChild(myEl4);
        }
      }

      // Creating (and hiding) every element, to allow for the grid to be properly completed, and unhiding any article after a new year is used in the WordPress API
      let compara = document.querySelectorAll(".a" + cDecade);
      if (compara[0].innerHTML === "") {
        let target2 = document.querySelector(".a" + cDecade);
        let myEl3 = document.createElement("li");
        let myEl5 = document.createElement("img");
        target2.appendChild(myEl3);
        myEl3.setAttribute("class", "not-visiblehelp");
        myEl5.setAttribute("src", "img/circle.svg");
        let myEl4 = document.createElement("p");
        myEl4.innerHTML = cDecade;
        myEl4.setAttribute("class", "decade decadeinactive" + " z" + cDecade);
        elemento.appendChild(myEl4);
        myEl3.appendChild(myEl5);
      }
    }
  }
}

// Asynchronous function to fectch the last updated article's thumbnail

async function buscarmediaultimo(_id, _media) {
  let url03 = "https://nit.fba.up.pt/dev/wp-json/wp/v2/media/";
  url03 += _media;

  let fonte = "";

  let resposta = await fetch(url03);

  if (!resposta.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const dados = await resposta.json();

  fonte = dados.media_details.sizes.thumbnail.source_url;

  let meuID = "#id-" + _id;

  // Creating the actual element and prepeding it to the inner HTML of the last updated article preview

  let figEl = document.createElement("img");
  figEl.setAttribute("src", fonte);

  ultimo.prepend(figEl);
}

// Asynchronous function to fectch the random article's thumbnail

async function buscarmediarandom(_id, _media) {
  let url03 = "https://nit.fba.up.pt/dev/wp-json/wp/v2/media/";
  url03 += _media;

  let fonte = "";

  let resposta = await fetch(url03);

  if (!resposta.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const dados = await resposta.json();

  fonte = dados.media_details.sizes.thumbnail.source_url;

  let meuID = "#id-" + _id;

  // Creating the actual element and prepeding it to the inner HTML of the random article preview

  let figEl = document.createElement("img");
  figEl.setAttribute("src", fonte);

  altr.prepend(figEl);
}
