var slideshowImageFrame =document.getElementById("animalSlideshowIntroImage");
var animalImageCollection = ["../../../_images/examples/animals/raccoon.jpg", "../../../_images/examples/animals/squirrel.jpg", "../../../_images/examples/animals/hyena.jpg", "../../../_images/examples/animals/tiger.jpg"];

var imageIndex = 0;
var introTimeout;
var slideshowTimer;

function changeImage(imageArray) {
    slideshowImageFrame.setAttribute("src", imageArray[imageIndex]);
    imageIndex++;
    if (imageIndex >= imageArray.length) {
        imageIndex = 0;
    }
}

function setSlideTimer() {
    slideshowTimer = window.setInterval(changeImage,2000,animalImageCollection);
}

function setIntroSlideTimeout() {	
    introTimeout = window.setTimeout(setSlideTimer,2500);
}

slideshowImageFrame.onclick = function() {

    clearInterval(slideshowTimer);
    
    if (slideshowImageFrame.getAttribute("src") === "../../../_images/examples/animals/hyena.jpg") {
        alert("That's correct! I LUBB U");
    } else {
        alert("Sorry, that's not a hyena, stupidy.");
        setSlideTimer();
    }
};

setIntroSlideTimeout();



