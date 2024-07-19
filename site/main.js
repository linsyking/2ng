var i = 0;
var slideTime = 10000;

if (!document.bgimgs) {
    document.bgimgs = [];
    document.bgimgs[0] = '/pic/bg0.jpg';
    document.bgimgs[1] = '/pic/bg1.jpg';
    document.bgimgs[2] = '/pic/bg2.jpg';
    document.bgimgs[3] = '/pic/bg3.jpg';
    document.bgimgs[4] = '/pic/bg4.jpg';
    document.bgimgs[5] = '/pic/bg5.jpg';
    document.bgimgs[6] = '/pic/bg6.jpg';
}

function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

shuffle(document.bgimgs);

function changePicture() {
    document.documentElement.style.backgroundImage = "url(" + document.bgimgs[i] + ")";

    if (i < document.bgimgs.length - 1) {
        i++;
    } else {
        i = 0;
    }
    setTimeout(changePicture, slideTime);
}

window.refreshPicture = () => {
    document.documentElement.style.backgroundImage = "url(" + document.bgimgs[0] + ")";
};

window.onload = changePicture;
