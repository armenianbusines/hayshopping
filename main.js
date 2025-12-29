let tvyalner = [];
let adminStatus = false;

function bacelModal(id){
    document.getElementById(id).style.display = "block";
}

function pakelModal(id){
    document.getElementById(id).style.display = "none";
}

function nkarelGulyavorEjy(){
    const grid = document.getElementById("himnakanGrid");
    grid.innerHTML = "";

    tvyalner.forEach(item => {
        if(!adminStatus && !item.hastatvac) return;

        const div = document.createElement("div");
        div.className = "qrt";
        div.innerHTML = `
            <img src="${item.logo}" style="width:100%;height:200px;object-fit:cover">
            <div style="padding:15px">
                <h3>${item.anun}</h3>
                <p>${item.kaxaq}</p>
            </div>
        `;
        grid.appendChild(div);
    });
}

db.ref("xanutner").on("value", snap=>{
    tvyalner = [];
    snap.forEach(s=>tvyalner.push({fbKey:s.key,...s.val()}));
    document.getElementById("loading").style.display="none";
    nkarelGulyavorEjy();
});
