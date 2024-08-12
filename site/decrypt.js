function fun() {
  const key = prompt("Enter the key");
  if (key) {
    this.localStorage.setItem("key", key);
    location.reload();
  }
}

window.addEventListener("load", function () {
  const enc = document.getElementsByTagName("encrypted")[0];
  const val = enc.attributes.data.value;
  const key = this.localStorage.getItem("key");
  if (!key) {
    document.getElementsByTagName("main")[0].innerHTML +=
      'Error: No key provided. <a onclick="fun()">Click to enter the key.</a>';
    return;
  }
  const decrypted = CryptoJS.AES.decrypt(val, key);
  const text = decrypted.toString(CryptoJS.enc.Utf8);
  enc.remove();
  if (text.length == 0) {
    document.getElementsByTagName("main")[0].innerHTML +=
      'Error: Incorrect key. <a onclick="fun()">Click to enter the key.</a>';
    return;
  }
  document.getElementsByTagName("main")[0].innerHTML += text;
});
