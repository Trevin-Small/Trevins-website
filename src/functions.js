export const Functions = (() => {

  const colorSchemes = [
    // Background, Table, Side-bar, Highlight
    ['#160025','#4f0147' ,'#4f0147'], // Dark: Purples
    ['#041C32', '#064663', '#ECB365'], // Dark: blue-green and yellow
    ['#fef9e', '#17c3b2', '#227c9d'] // Light: Greens
  ]

  function rescaleIcons(){
    let icons = document.getElementsByName('icon-svg');
    let icon_boxes = document.getElementsByClassName("icon-box");
    let maxSize = 35;
    let widthBasedSize = Math.floor(window.innerWidth * 0.11 - 12);
    let size = widthBasedSize > maxSize ? maxSize : widthBasedSize;
    for (let i = 0; i < icons.length; i++){
        icons[i].style.fontSize = size + 'px';
        icon_boxes[i].style.padding = "6px";
    }
    let switchIcon = document.getElementsByName('switch');
    switchIcon[0].style.height = (size / 1.8) + 'px';
    switchIcon[0].style.padding = "0px";
  }

  function rescaleFont() {
    let messageBoxes = document.getElementsByClassName("message-box");
    for (let i = 0; i < messageBoxes.length; i++) {
        let smallerDimension = window.innerWidth < window.innerHeight ? window.innerWidth : window.innerHeight;
        if (smallerDimension < 1100) {
            messageBoxes[i].style.fontSize = smallerDimension * 0.035;
        } else {
            messageBoxes[i].style.fontSize = smallerDimension * 0.0275;
        }
    }
  }

  function hideElement(id){
    document.getElementById(id).style.visibility = "hidden";
  }

  function showElement(id, displayType){
    document.getElementById(id).style.visibility = displayType;
  }

  function setColorScheme(number) {
    document.getElementById('background').style.backgroundColor = colorSchemes[number][0];
    document.getElementById('my-work-table').style.backgroundColor = colorSchemes[number][1];
    document.getElementById('side-bar').style.backgroundColor = colorSchemes[number][2];
    // Highlight color has to be changed manually :|

    let file = '';
    if (number == 0) {
        file = 'fractal-dark.svg';
    } else if (number == 1) {
        file = 'fractal-green.svg';
    } else if (number = 2) {
        file = 'fractal-light.svg';
    }
    document.getElementById('fractal-svg').src = './images/' + file;
  }

  return {
    colorSchemes,
    rescaleIcons,
    rescaleFont,
    hideElement,
    showElement,
    setColorScheme
  }

})();