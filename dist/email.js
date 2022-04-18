function copyEmail() {
  document.getElementById('email-alert-box').style.visibility =  "visible";
  navigator.clipboard.writeText("contact@trevinsmall.com");
  setTimeout(function(){
      document.getElementById('email-alert-box').style.visibility = "hidden";
  }, 1500);
}