//1! elemek kiválasztása, változók

const parentObj = document.querySelector("#parent");
const startObj = document.querySelector("#start");
const ujraObj = document.querySelector("#ujra");
const segitsegObj = document.querySelector("#segitseg");
const jatekosszamObj = document.querySelector("#jatekosszam");
const kincsObj = document.querySelector("#kincsszam");
const girdObj = document.querySelector("#gird");
const bObj = document.querySelector("#b");
const pluszObj = document.querySelector("#plusz");
const jObj = document.querySelector("#j");
const kor_vegeObj = document.querySelector("#kor_vege");
const leirasObj = document.querySelector("#leiras");
const statObj = document.querySelector("#stat");
const aktual_playerObj = document.querySelector("#aktual_player");
const msObj = document.querySelector("#ms");


//szobák
function szobak() {
    let S1 = new Array(13).fill('0101');
    let S2 = new Array(15).fill('0110');
    let S3 = new Array(6).fill('0111');
    let A = S1.concat(S2, S3);
    return A;
}

function set_players() {
    p1 = {
        id: 1,  //id
        s: 1,   //kezdőhely(ahova vissza kell érnie)
        xy: 1,  //aktuális pozició
        k: kincs_gen(), //kincs helye
        ck: 0   //megszerzett kincsek száma
    };

    p2 = {
        id: 2,
        s: 7,
        xy: 7,
        k: kincs_gen(),
        ck: 0
    }
    p3 = {
        id: 3,
        s: 43,
        xy: 43,
        k: kincs_gen(),
        ck: 0
    }
    p4 = {
        id: 4,
        s: 49,
        xy: 49,
        k: kincs_gen(),
        ck: 0
    }
    g = {
        player: 1,
    }
}
//kincs generálása valid helyre
let K=[];   //ha egy mezőn volt kincs a játék során,akkor soha többet nem lehet (tömben tároljuk a kincsek helyét)
function kincs_gen() {
    t = Math.floor((Math.random() * 48) + 1);
    while (t == 1 || t == 7 || t == 43 || K.includes(t)) {t = Math.floor((Math.random() * 49) + 1);}
    K.push(t);
    return t;
}


//2! kattintás esemény 

//játék indítása (gomb)
startObj.addEventListener("click", start);
function start() {
    let ply_num = parseInt(jatekosszamObj.value);
    if (ply_num < 1 || 4 < ply_num) {
        msObj.style.display = "block";
        msObj.innerHTML = "Hiba történt! Nem megfelelő számú játékos!"
    }
    else if (kincsObj.value < 1 || (24 / jatekosszamObj.value) < kincsObj.value) {
        msObj.style.display = "block";
        msObj.innerHTML = "Hiba történt! Nem megfelelő számú kincs!"
    }
    else {
        aktual_playerObj.innerHTML = "1. játékos köre";

        document.getElementById("start").disabled = true;
        document.getElementById("jatekosszam").disabled = true;
        document.getElementById("kincsszam").disabled = true;
        parentObj.style.display = "block";
        msObj.innerHTML = "";
        msObj.style.display = "block"; //csak az újraindítás miadt

        //rács és plusz elem kirajzolása
        gird();
        pluszelem();

        //bábúk felrakása a sarokokba
        set_players();
        all_draw();
    }
}

//játék ujra kezdése (gomb)
ujraObj.addEventListener("click", restart);
function restart() {
    aktual_playerObj.innerHTML = "";
    statObj.innerHTML = "";
    girdObj.innerHTML = "";
    K=[];
    enable();
    document.getElementById("start").disabled = false;
    document.getElementById("jatekosszam").disabled = false;
    document.getElementById("kincsszam").disabled = false;
    parentObj.style.display = "none";
}

//segítség (gomb)
segitsegObj.addEventListener("click", function () {
    if (leirasObj.style.display === "none") {
        leirasObj.style.display = "block";
    } else {
        leirasObj.style.display = "none";
    }
});

//plusz elem balra forgatása (gomb)
bObj.addEventListener("click", function () {
    A[0] = forgatas(A[0]);
    pluszObj.innerHTML = `<div class="d0" id="d0" value='${A[0]}'></div>`;
    door(0);
});

//plusz elem jobbra forgatása (gomb)
jObj.addEventListener("click", kattintás5);
function kattintás5() {
    for (let i = 0; i < 3; i++) {
        A[0] = forgatas(A[0]);
    }
    pluszObj.innerHTML = `<div class="d0" id="d0" value='${A[0]}'></div>`;
    door(0);
}



//3 fügvények

//7X7-es négyzetrács valid kirajzolása
function gird() {
    A = szobak(); //szobák tömbe helyezése
    for (let i = 1; i < 50; i++) {
        if (i == 1) { girdObj.innerHTML += `<div class="d${i}" id="d${i}" value='0110'></div>`; door(i); }
        else if (i == 7) { girdObj.innerHTML += `<div class="d${i}" id="d${i}" value='0011'></div>`; door(i); }
        else if (i == 43) { girdObj.innerHTML += `<div class="d${i}" id="d${i}" value='1100'></div>`; door(i); }
        else if (i == 49) { girdObj.innerHTML += `<div class="d${i}" id="d${i}" value='1001'></div>`; door(i); }
        else if (i == 3 || i == 5 || i == 19) { girdObj.innerHTML += `<div class="d${i}" id="d${i}" value='0111'></div>`; door(i); }
        else if (i == 15 || i == 17 || i == 29) { girdObj.innerHTML += `<div class="d${i}" id="d${i}" value='1110'></div>`; door(i); }
        else if (i == 21 || i == 33 || i == 35) { girdObj.innerHTML += `<div class="d${i}" id="d${i}" value='1011'></div>`; door(i); }
        else if (i == 31 || i == 45 || i == 47) { girdObj.innerHTML += `<div class="d${i}" id="d${i}" value='1101'></div>`; door(i); }
        else {
            //egy elem kiválasztása a tömböl majd kitörlése
            let index = Math.floor(Math.random() * A.length);
            let t = A[index];
            A.splice(index, 1);

            //random forgatás
            let a = Math.floor((Math.random() * 4) + 0);
            for (let j = 0; j < a; j++) {
                t = forgatas(t);
            }

            //rajzolás
            girdObj.innerHTML += `<div class="d${i}" id="d${i}" value='${t}'></div>`;
            door(i);
        }

    }
}




//plusz elem
function pluszelem() {
    let t = A[0];
    pluszObj.innerHTML = `<div class="d0" id="d0" value='${t}'></div>`;
    door(0);
}


//forgatás
function forgatas(i) {
    return i[3].concat(i.substr(0, 3));
}




//ajtók és falak kirajzolása
function door(i) {
    let tmp = document.getElementById('d' + i).getAttribute('value');
    for (let j = 0; j < 4; j++) {
        if (tmp[j] == '0') {
            if (j == 0) document.getElementById('d' + i).style.borderTop = "10px solid black";
            if (j == 1) document.getElementById('d' + i).style.borderRight = "10px solid black";
            if (j == 2) document.getElementById('d' + i).style.borderBottom = "10px solid black";
            if (j == 3) document.getElementById('d' + i).style.borderLeft = "10px solid black";
        }
        else {
            if (j == 0) document.getElementById('d' + i).style.borderTop = "10px dashed brown";
            if (j == 1) document.getElementById('d' + i).style.borderRight = "10px dashed brown";
            if (j == 2) document.getElementById('d' + i).style.borderBottom = "10px dashed brown";
            if (j == 3) document.getElementById('d' + i).style.borderLeft = "10px dashed brown";
        }
    }
}



//Játékos lépés (billentyűzeten nyilakkal, majd kör elpaszolása egy gombbal)
document.addEventListener('keydown', Key);
function Key(e) {
    //mozgatás "wasd" alapján
    if (e.key == "w") player_move(0, eval("p" + g.player));
    else if (e.key == "d") player_move(1, eval("p" + g.player));
    else if (e.key == "s") player_move(2, eval("p" + g.player));
    else if (e.key == "a") player_move(3, eval("p" + g.player));
    else console.log(e.key + " -> rossz billenytű"); //consol input ha rossz billentyűt nyomsz meg
}

kor_vegeObj.addEventListener("click", kattintás6);
function kattintás6() {
    possible_move_rem(eval("p" + g.player));
    if (g.player < jatekosszamObj.value) { g.player = g.player + 1; }
    else { g.player = 1 }
    enable();
    aktual_playerObj.innerHTML = g.player + ". játkos köre";
}





//(játékos mozgatása és) bábúk és kincsek újra rajzolása, kincsre lépés és ngyőzelem vizs
function player_move(d, z) {
    //becsuztattuk-e az elemet? (ha button 1 levan tiltva, akkor igen)
    if (document.getElementById("b1").disabled == true) {
        possible_move_rem(eval("p" + g.player)); //lehetséges lépések eltüntetése
        if (d == 0 && z.xy - 7 > 0 && '1' == document.getElementById('d' + z.xy).getAttribute('value')[0] && '1' == document.getElementById('d' + (z.xy - 7)).getAttribute('value')[2]) {
            all_del(); //bábúk, kincsek és stat törlése
            z.xy = z.xy - 7;    //ha tud lépni akkor hely kordináta modósítása
            kincsre_lepes(z);   //kincsre lépés visz
            all_draw(); //bábúk, kincsek és stat újra rajzolása
        }
        else if (d == 1 && !(z.xy + 1 == 8 || z.xy + 1 == 15 || z.xy + 1 == 22 || z.xy + 1 == 29 || z.xy + 1 == 36 || z.xy + 1 == 43 || z.xy + 1 == 50) && '1' == document.getElementById('d' + z.xy).getAttribute('value')[1] && '1' == document.getElementById('d' + (z.xy + 1)).getAttribute('value')[3]) {
            all_del();
            z.xy = z.xy + 1;
            kincsre_lepes(z);
            all_draw();
        }
        else if (d == 2 && z.xy + 7 < 50 && '1' == document.getElementById('d' + z.xy).getAttribute('value')[2] && '1' == document.getElementById('d' + (z.xy + 7)).getAttribute('value')[0]) {
            all_del();
            z.xy = z.xy + 7;
            kincsre_lepes(z);
            all_draw();
        }
        else if (d == 3 && !(z.xy - 1 == 0 || z.xy - 1 == 7 || z.xy - 1 == 14 || z.xy - 1 == 21 || z.xy - 1 == 28 || z.xy - 1 == 35 || z.xy - 1 == 42) && '1' == document.getElementById('d' + z.xy).getAttribute('value')[3] && '1' == document.getElementById('d' + (z.xy - 1)).getAttribute('value')[1]) {
            all_del();
            z.xy = z.xy - 1;
            kincsre_lepes(z);
            all_draw();
        }
        console.log(z.xy + " -> ezen a mezőn áll a bábú"); //consol.log
        possible_move(eval("p" + g.player)); //lehetséges lépés kirajzolása
    }  
    win(z); //győzelem vizsgálata
}

function all_del() {
    for (let i = 1; i < parseInt(jatekosszamObj.value) + 1; i++) {
        const kincsObj = document.querySelector('#d' + eval('p' + i).k);
        kincsObj.innerHTML = "";
        const palyerObj = document.querySelector('#d' + eval('p' + i).xy);
        palyerObj.innerHTML = "";
    }
    statObj.innerHTML = "";
}

function all_draw() {
    //kincs kirajzolása (igy mindig a kincs lesz elöl és utána jönnek a bábuk)
    for (let i = 1; i < parseInt(jatekosszamObj.value) + 1; i++) {
        let tmp = eval('p' + i);
        //ha a kincs nem a 0 mezőn van akkor kirajzoljuk
        if (tmp.k != 0) {
            const kincsObj = document.querySelector('#d' + tmp.k);
            kincsObj.innerHTML += `<div class="k${tmp.id}" id="k${tmp.id}">✖</div>`;
        }
    }
    //player kirajzolása
    for (let i = 1; i < parseInt(jatekosszamObj.value) + 1; i++) {
        let tmp = eval('p' + i);

        const palyerObj = document.querySelector('#d' + tmp.xy);
        palyerObj.innerHTML += `<div class="p${tmp.id}" id="p${tmp.id}">${tmp.id}</div>`;

        statObj.innerHTML += tmp.id + ". játékos: " + kincsObj.value + "/" + tmp.ck + `<br>`;
    }
}

//szomszédos mező lépés
function possible_move(z) {
    document.getElementById('d' + z.xy).style.backgroundColor = "purple";
    if (z.xy - 7 > 0 && '1' == document.getElementById('d' + z.xy).getAttribute('value')[0] && '1' == document.getElementById('d' + (z.xy - 7)).getAttribute('value')[2]) {
        document.getElementById('d' + (z.xy - 7)).style.backgroundColor = "green";
    }
    if (!(z.xy + 1 == 8 || z.xy + 1 == 15 || z.xy + 1 == 22 || z.xy + 1 == 29 || z.xy + 1 == 36 || z.xy + 1 == 43 || z.xy + 1 == 50) && '1' == document.getElementById('d' + z.xy).getAttribute('value')[1] && '1' == document.getElementById('d' + (z.xy + 1)).getAttribute('value')[3]) {
        document.getElementById('d' + (z.xy + 1)).style.backgroundColor = "green";
    }
    if (z.xy + 7 < 50 && '1' == document.getElementById('d' + z.xy).getAttribute('value')[2] && '1' == document.getElementById('d' + (z.xy + 7)).getAttribute('value')[0]) {
        document.getElementById('d' + (z.xy + 7)).style.backgroundColor = "green";
    }
    if (!(z.xy - 1 == 0 || z.xy - 1 == 7 || z.xy - 1 == 14 || z.xy - 1 == 21 || z.xy - 1 == 28 || z.xy - 1 == 35 || z.xy - 1 == 42) && '1' == document.getElementById('d' + z.xy).getAttribute('value')[3] && '1' == document.getElementById('d' + (z.xy - 1)).getAttribute('value')[1]) {
        document.getElementById('d' + (z.xy - 1)).style.backgroundColor = "green";
    }
}
function possible_move_rem(z) {
    document.getElementById('d' + z.xy).style.backgroundColor = "#8b7b1c";
    if (z.xy - 7 > 0 && '1' == document.getElementById('d' + z.xy).getAttribute('value')[0] && '1' == document.getElementById('d' + (z.xy - 7)).getAttribute('value')[2]) {
        document.getElementById('d' + (z.xy - 7)).style.backgroundColor = "#8b7b1c";
    }
    if (!(z.xy + 1 == 8 || z.xy + 1 == 15 || z.xy + 1 == 22 || z.xy + 1 == 29 || z.xy + 1 == 36 || z.xy + 1 == 43 || z.xy + 1 == 50) && '1' == document.getElementById('d' + z.xy).getAttribute('value')[1] && '1' == document.getElementById('d' + (z.xy + 1)).getAttribute('value')[3]) {
        document.getElementById('d' + (z.xy + 1)).style.backgroundColor = "#8b7b1c";
    }
    if (z.xy + 7 < 50 && '1' == document.getElementById('d' + z.xy).getAttribute('value')[2] && '1' == document.getElementById('d' + (z.xy + 7)).getAttribute('value')[0]) {
        document.getElementById('d' + (z.xy + 7)).style.backgroundColor = "#8b7b1c";
    }
    if (!(z.xy - 1 == 0 || z.xy - 1 == 7 || z.xy - 1 == 14 || z.xy - 1 == 21 || z.xy - 1 == 28 || z.xy - 1 == 35 || z.xy - 1 == 42) && '1' == document.getElementById('d' + z.xy).getAttribute('value')[3] && '1' == document.getElementById('d' + (z.xy - 1)).getAttribute('value')[1]) {
        document.getElementById('d' + (z.xy - 1)).style.backgroundColor = "#8b7b1c";
    }
}


function kincsre_lepes(z) {
    //ha kincsre léptünk akkor feljegyezzük és generálunk egy újat; ha felszedtük az összes kincsüket akkor 0 értékre állítjuk (plusz elemre rajzolná ki de kezeljük az all_draw-ban)
    if (z.xy == z.k && z.ck < kincsObj.value) {
        z.ck++;
        z.k = kincs_gen();
    }
    if (z.ck == kincsObj.value) z.k = 0;
}

function win(z) {
    if (z.ck == kincsObj.value && z.xy == z.s) {
        document.removeEventListener("keydown", Key); //nem tudunk többet lépni
        disable(); //nem tudunk elemet becsuztatni
        aktual_playerObj.innerHTML = "";
        document.getElementById("kor_vege").disabled = true;
        statObj.innerHTML = "Nyertes: " + z.id + ". játékos!";
    }
}





//nyil eseménykezelő és feldologozó
document.querySelector("#b1").addEventListener("click", function () { minus(44, 2, 7) });
document.querySelector("#b2").addEventListener("click", function () { minus(46, 4, 7); });
document.querySelector("#b3").addEventListener("click", function () { minus(48, 6, 7); });
document.querySelector("#b4").addEventListener("click", function () { plus(8, 14, 1); });
document.querySelector("#b5").addEventListener("click", function () { plus(22, 28, 1); });
document.querySelector("#b6").addEventListener("click", function () { plus(36, 42, 1); });
document.querySelector("#b7").addEventListener("click", function () { plus(2, 44, 7); });
document.querySelector("#b8").addEventListener("click", function () { plus(4, 46, 7); });
document.querySelector("#b9").addEventListener("click", function () { plus(6, 48, 7); });
document.querySelector("#b10").addEventListener("click", function () { minus(14, 8, 1); });
document.querySelector("#b11").addEventListener("click", function () { minus(28, 22, 1); });
document.querySelector("#b12").addEventListener("click", function () { minus(42, 36, 1); });


function plus(x, y, z) {
    let b = document.getElementById('d' + x).getAttribute('value');
    for (let i = x; i < y; i = i + z) {
        let s = document.getElementById('d' + (i + z)).getAttribute('value');
        document.getElementById("d" + i).setAttribute('value', s);
        door(i);
    }
    let a = document.getElementById('d0').getAttribute('value');
    document.getElementById("d" + y).setAttribute('value', a);
    document.getElementById("d0").setAttribute('value', b);
    A[0] = b;
    door(y);
    door(0);
    disable();

}

function minus(x, y, z) {
    let b = document.getElementById('d' + x).getAttribute('value');
    for (let i = x; i > y; i = i - z) {
        let s = document.getElementById('d' + (i - z)).getAttribute('value');
        document.getElementById("d" + i).setAttribute('value', s);
        door(i);
    }
    let a = document.getElementById('d0').getAttribute('value');
    document.getElementById("d" + y).setAttribute('value', a);
    document.getElementById("d0").setAttribute('value', b);
    A[0] = b;
    door(y);
    door(0);
    disable();
}


function disable() {
    for (let i = 1; i < 13; i++) {
        document.getElementById("b" + i).disabled = true;
    }
    document.getElementById("b").disabled = true;
    document.getElementById("j").disabled = true;
    possible_move(eval("p" + g.player)); //lehetséges lépés kirajzolása becsuztatás után
}
function enable() {
    for (let i = 1; i < 13; i++) {
        document.getElementById("b" + i).disabled = false;
    }
    document.getElementById("b").disabled = false;
    document.getElementById("j").disabled = false;
}