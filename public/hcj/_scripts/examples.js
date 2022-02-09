//////////////////////////////////////////////////////////////

var captainObviousButton = document.getElementById("captainObviousButton");

function stateTheObvious() {
    alert('You have clicked the button.');
}

/*
captainObviousButton.onclick = function() {
    alert('You have clicked the button.');
};*/

captainObviousButton.addEventListener('click',stateTheObvious,false);

/////////////////////////////////////////////////////////////////

var container = document.getElementById("focusblurtestContainer");
var textbox = document.getElementById("focusblurtest");

function changeBGcolorBlue() {
    container.style = "background-color:#0046b7";
}

function changeBGcolorPurple() {
    container.style = "background-color:#7c0099";
}

textbox.addEventListener("focus", changeBGcolorBlue, false);
textbox.addEventListener("blur", changeBGcolorPurple, false);

/////////////////////////////////////////////////////////////////

var emailField = document.getElementById("focusblurtest2");

emailField.onfocus = function() {
    if (emailField.value === "your email") {
        emailField.value = "";
    }
};

emailField.onblur = function() {
    if (emailField.value === "") {
        emailField.value = "your email";
    }
};


/////////////////////////////////////////////////////////////////

var callStackInputField = document.getElementById("callStackExample");
var callStackExampleButton = document.getElementById("callStackExampleButton");

var MTSStyleLength = 13;

callStackExampleButton.onclick = function() {
    
    var inputStyle = {
    
        value_init: callStackInputField.value,
        value_clean: "",
        value_delim: "",
        type: "",
        cls: "",
        vendor: "",
        style: "",
        groom() {
            this.addDelims("-");
            callStackInputField.value = this.value_delim;
        },
        addDelims(delimSymbol) {
            this.extractCVS();
            this.value_delim = (this.cls + delimSymbol + this.vendor + delimSymbol + this.style);
        },
        extractCVS() {
            this.judge();
            if (this.type == "MTS") {
                this.cls = this.value_clean.substr(0,4);
                this.vendor = this.value_clean.substr(4,5);
                this.style = this.value_clean.substr(9,4);
            }
        },
        judge() {
            this.clean();
            if (this.value_clean.length == MTSStyleLength) {
                this.type = "MTS";
            }
        },
        clean() {
            this.value_clean = this.value_init.trim();
        }
        
    };
    
    inputStyle.groom();
    
};


/////////////////////////////

var colorBox = document.getElementById("JSstyleexample");
    
colorBox.onclick = function() {
    if (this.style.backgroundColor === "yellow") { 
        this.style.backgroundColor = "red";
        this.style.color = "white";
        this.style.fontWeight = "bold"; 
    } else {
        this.style.backgroundColor = "yellow";
        this.style.color = "black";
        this.style.fontWeight = "normal";    
    }
};
    
////////////////

$("#lebronHide").click(function() {
    $(this).hide(4000);
});

$("#lebronFade").click(function() {
    $(this).fadeOut(4000);
});

////////////////

function exJSwindowWidth () {
  var jsContentWidthCell = document.getElementById("exJSwindowWidthContent");
  var jsTotalWidthCell = document.getElementById("exJSwindowWidthAll");
  jsContentWidthCell.innerHTML = document.documentElement.clientWidth;
  jsTotalWidthCell.innerHTML = window.outerWidth;
}

window.addEventListener('load', exJSwindowWidth);
window.addEventListener('resize', exJSwindowWidth);

function exJSwindowHeight () {
  var jsContentHeightCell = document.getElementById("exJSwindowHeightContent");
  var jsTotalHeightCell = document.getElementById("exJSwindowHeightAll");
  jsContentHeightCell.innerHTML = document.documentElement.clientHeight;
  jsTotalHeightCell.innerHTML = window.outerHeight;
}

window.addEventListener('load', exJSwindowHeight);
window.addEventListener('resize', exJSwindowHeight);

// JQuery

$(window).on('load resize', function() {
  $('#exJQwindowWidthContent').html($(window).width());
});

$(window).on('load resize', function() {
  $('#exJQwindowHeightContent').html($(window).height());
});


/////////////////////////


/*const splitInput = (input, char) => {
  const inputTrimmed = input.trim();
  const resultArr = inputTrimmed.split(char);
  if (resultArr.length === 1) {
    return false;
  } else {
    return resultArr;
  }
}*/

///////

$('#popQuote').on('click',function() {
  $('#popBody').slideToggle();
})

$('#popQuoteSlow').on('click',function() {
  $('#popBodySlow').slideToggle(2000);
})















