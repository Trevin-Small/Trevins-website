export const Functions = (() => {

  const colorSchemes = [
    // Background, Table, Side-bar, Highlight
    ['#160025','#4f0147' ,'#4f0147'], // Dark: Purples
    ['#041C32', '#17c3b2', '#ECB365'], // Dark: blue-green and yellow
    ['#fef9e', '#17c3b2', '#227c9d'] // Light: Greens
  ]

  const PAGES = [
    "page-about-me",
    "page-my-work",
    "page-resume"
  ]

  const ACTIVE_GRAY = "#4b5563";
  const INACTIVE_GRAY = "#1f2937";
  const maxIconSize = 40;
  const tabs = document.getElementsByName('tab');

  let currentTabNum = 0;

  function rescaleIcons(){
    let icons = document.getElementsByName('icon-svg');
    let icon_boxes = document.getElementsByClassName("icon-box");
    let widthBasedSize = Math.floor(window.innerWidth * 0.1 - 12);
    let size = widthBasedSize > maxIconSize ? maxIconSize : widthBasedSize;
    for (let i = 0; i < icons.length; i++){
        icons[i].style.fontSize = size + 'px';
        icon_boxes[i].style.padding = "4px";
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
        file = 'fractal-light.svg';
    } else if (number = 2) {
        file = 'fractal-light.svg';
    }
    document.getElementById('fractal-svg').src = './images/' + file;
  }

  function switchPage(tabNumber) {
    let currentTab = document.getElementById(PAGES[currentTabNum]);
    let newTab = document.getElementById(PAGES[tabNumber]);

    currentTab.style.display = 'none';
    newTab.style.display = 'block';

    tabs[currentTabNum].style.backgroundColor = INACTIVE_GRAY;
    tabs[tabNumber].style.backgroundColor = ACTIVE_GRAY;

    currentTabNum = tabNumber;
  }

  function tabListener() {
    let tabCounter = 0;
    for (let i = 0; i < tabs.length; i++) {
      if (tabCounter != currentTabNum) {
        tabs[i].style.backgroundColor = INACTIVE_GRAY;
      } else {
        tabs[i].style.backgroundColor = ACTIVE_GRAY;
      }

      tabs[i].addEventListener('click', () => {
        switchPage(Number(tabs[i].id));
      });
      tabCounter++;
    }
  }

  tabListener();

  return {
    colorSchemes,
    rescaleIcons,
    rescaleFont,
    hideElement,
    showElement,
    setColorScheme,
  }

})();