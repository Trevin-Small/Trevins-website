import { Functions } from './functions.js';
import { Waves } from './waves.js';


window.onload = function() {
    Waves.init(document.body);
    Functions.rescaleFont();
    Functions.rescaleIcons();
    //let colorSchemeNum = Math.floor(Math.random() * colorSchemes.length);
    //setColorScheme(colorSchemeNum); // Uncomment for randomized color schemes
    Functions.setColorScheme(2);

    window.onresize = function() {
        Waves.stopRender();
        Functions.resize();
        Functions.rescaleIcons();
        Functions.rescaleFont();
        shapes = generateShapes();
        Waves.startRender();
    };

    setTimeout(() => {
        document.getElementById('md-abt-me-top').src = "./markdown/resume.md";
    }, 3000);
}