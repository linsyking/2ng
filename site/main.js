var i = 0;
var slideTime = 5000; // 3 seconds

if (!document.bgimgs){
    document.bgimgs = [];
    document.bgimgs[0] = '/pic/bg1.jpg';
    document.bgimgs[1] = '/pic/bg2.png';
}


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
