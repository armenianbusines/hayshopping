// ======================
// Firebase
// ======================
const firebaseConfig = {
    apiKey: "AIzaSyAXH7T_obCBUuG4zXhY0qpwwBfb3JgMOrI",
    authDomain: "hayshop-b54ab.firebaseapp.com",
    databaseURL: "https://hayshop-b54ab-default-rtdb.firebaseio.com/",
    projectId: "hayshop-b54ab",
    storageBucket: "hayshop-b54ab.appspot.com",
    messagingSenderId: "342283633284",
    appId: "1:342283633284:web:7e2def7ad150124636f8d1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ======================
// Globals
// ======================
let tvyalner = [];
let adminStatus = false;
let globalRating = 0;

// ======================
// Modals
// ======================
function bacelModal(id){
    document.getElementById(id).style.display = "block";
}

function pakelModal(id){
    document.getElementById(id).style.display = "none";
}

// ======================
// Render Shops
// ======================
function nkarelGulyavorEjy(shopId=null){
    const grid = document.getElementById("himnakanGrid");
    grid.innerHTML = "";

    if(shopId){
        const item = tvyalner.find(t => t.fbKey === shopId);
        if(!item){
            grid.innerHTML = "<p>Խանութը չի գտնվել</p>";
            return;
        }
        const div = document.createElement("div");
        div.className = "qrt";
        div.innerHTML = `
            <img src="${item.logo}" style="width:100%;height:200px;object-fit:cover">
            <div style="padding:15px">
                <h3>${item.anun}</h3>
                <p>${item.kaxaq}</p>
                <p>${item.description || ""}</p>
            </div>
        `;
        grid.appendChild(div);
        return;
    }

    tvyalner.forEach(item => {
        if(!adminStatus && !item.hastatvac) return;

        const div = document.createElement("div");
        div.className = "qrt";
        div.innerHTML = `
            <a href="#/shop/${item.fbKey}">
                <img src="${item.logo}" style="width:100%;height:200px;object-fit:cover">
                <div style="padding:15px">
                    <h3>${item.anun}</h3>
                    <p>${item.kaxaq}</p>
                </div>
            </a>
        `;
        grid.appendChild(div);
    });
}

// ======================
// Ratings
// ======================
function selectStars(n) {
    globalRating = n;
    let stars = document.querySelectorAll('#star-rating-icons span');
    stars.forEach((s, i) => {
        s.innerHTML = (i < n) ? '★' : '☆';
        s.style.color = (i < n) ? '#f1c40f' : '#ccc';
    });
}

function submitRating() {
    let name = document.getElementById('user-full-name').value.trim();
    let status = document.getElementById('rating-status');
    if (name === "" || globalRating === 0 || !/^[ա-ֆԱ-Ֆ\s]+$/.test(name)) {
        status.style.color = "red";
        status.innerText = "⚠️ Լրացրեք անունը հայատառ և ընտրեք աստղերը:";
        return;
    }
    let reviewData = { fullName: name, starsCount: globalRating, postDate: new Date().toLocaleString('hy-AM') };
    let existingReviews = JSON.parse(localStorage.getItem('hayshop_database') || "[]");
    existingReviews.push(reviewData);
    localStorage.setItem('hayshop_database', JSON.stringify(existingReviews));
    status.style.color = "green";
    status.innerText = "✅ Գրանցվեց:";
    document.getElementById('user-full-name').value = "";
    selectStars(0);
}

// ======================
// Hash Routing
// ======================
function handleRoute() {
    const hash = location.hash || "#/home";

    if(hash.startsWith("#/shop/")) {
        const id = hash.split("/")[2];
        nkarelGulyavorEjy(id);
    } else if(hash === "#/reviews") {
        const grid = document.getElementById("himnakanGrid");
        grid.innerHTML = "<h2>Օգտատերերի գնահատումներ</h2>";
        const reviews = JSON.parse(localStorage.getItem('hayshop_database') || "[]");
        reviews.forEach(r=>{
            const div = document.createElement("div");
            div.className = "qrt";
            div.innerHTML = `<p>Անուն: ${r.fullName}</p><p>Աստղեր: ${r.starsCount}</p><p>Ամսաթիվ: ${r.postDate}</p>`;
            grid.appendChild(div);
        });
    } else if(hash === "#/add") {
        const grid = document.getElementById("himnakanGrid");
        grid.innerHTML = "<h2>Նոր խանութ ավելացնել</h2>";
        // այստեղ կարող է լինել ֆորման
    } else {
        nkarelGulyavorEjy();
    }
}

window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", handleRoute);

// ======================
// Dynamic Sitemap
// ======================
function generateSitemap() {
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    sitemap += `<url><loc>https://armenianbusines.github.io/hayshopping/#/home</loc><priority>1.0</priority></url>\n`;
    tvyalner.forEach(item => {
        sitemap += `<url><loc>https://armenianbusines.github.io/hayshopping/#/shop/${item.fbKey}</loc></url>\n`;
    });
    sitemap += `<url><loc>https://armenianbusines.github.io/hayshopping/#/reviews</loc></url>\n`;
    sitemap += `<url><loc>https://armenianbusines.github.io/hayshopping/#/add</loc></url>\n`;
    sitemap += "</urlset>";
    console.log(sitemap); // կարող ես ուղարկել Google Search Console
}

// ======================
// Firebase listener
// ======================
db.ref("xanutner").on("value", snap=>{
    tvyalner = [];
    snap.forEach(s=>tvyalner.push({fbKey:s.key,...s.val()}));
    document.getElementById("loading").style.display="none";
    nkarelGulyavorEjy();
    generateSitemap();
});
