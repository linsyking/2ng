var i = 0;
var slideTime = 10000;

if (!document.bgimgs) {
    document.bgimgs = [];
    document.bgimgs[0] = '/pic/bg0.jpg';
    document.bgimgs[1] = '/pic/bg1.jpg';
    document.bgimgs[2] = '/pic/bg2.jpg';
    document.bgimgs[3] = '/pic/bg5.jpg';
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

function compressPath(path){
    let mp = path.substring(0, path.length - 1);
    let paths = mp.split('/');
    let result = "";
    for(let i = 0; i < paths.length - 1; i++){
        if (paths[i][0]){
            result += paths[i][0];
        }
    }
    if (paths.length == 0){
        return "null";
    }
    return result + "/" + paths[paths.length - 1];
}

window.onload = () => {
    changePicture();

    const gitalk = new Gitalk({
        clientID: '62f26ddc20e6f5a80420',
        clientSecret: '047e8e4fe5160c3a6bae00f33257abd81a258bdb',
        repo: '2ng',      // The repository of store comments,
        owner: 'linsyking',
        admin: ['linsyking'],
        id: compressPath(location.pathname),      // Ensure uniqueness and length less than 50
        body: location.href,
        distractionFreeMode: false  // Facebook-like distraction free mode
    })

    gitalk.render('gitalk-container')
}
