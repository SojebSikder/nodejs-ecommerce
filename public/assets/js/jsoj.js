/**
 * Author : Sojeb sikder
 * Update Date: 11.29 AM, Monday, September 28, 2020
 */

/**
 * Replace text with high performance
 * @param {*} str
 * @param {*} search
 * @param {*} replacement
 */
function rep(str, search, replacement) {
  return str.split(search).join(replacement);
}

// implements debounce
// function debounce(func, wait = 20, immediate = true) {
//   var timeout;
//   return function () {
//     var context = this,
//       args = arguments;
//     var later = function () {
//       timeout = null;
//       if (!immediate) func.apply(context, args);
//     };
//     var callNow = immediate && !timeout;
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//     if (callNow) func.apply(context, args);
//   };
// }

// simple debouce
const debounce = function (fn, delay) {
  let timer;
  return function () {
    let context = this,
      args = arguments;

    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
};

/**
 * Soj class for defining bihongoJs
 */
class Soj {
  /**
   * framework Initialize
   */
  constructor({ el, data }) {
    window.location.href = "#/";

    this.query = document.querySelector(el);
    this.data = data;

    this.perser(this.query, this.data);
  }

  /**
   * Persing
   * @param {*} query querySelector
   * @param {*} data data
   */
  perser(query, data) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        var element = data[key];
        query.innerHTML = rep(
          query.innerHTML,
          new RegExp("{{.*" + key + "*.}}"),
          element
        );
      }
    }
    return this;
  }

  /**
   * Controller setup
   * @param {*} string
   * @param {Function} callback
   */
  controller(string, callback) {
    if (string == this.controll) {
      callback();
    }
    return this;
  }

  /**
   * Initialize Route
   * @param {*} evt
   */
  config(evt) {
    window.onhashchange = function () {
      evt();
    };

    return this;
  }

  /**
   * Define application route
   * @param {string} path
   * @param {array} arr
   */
  route(path, arr) {
    this.path = path;
    var url = window.location.href;
    var hashReplace = rep(url, "!", "");
    //var server = hashReplace.indexOf("/");

    var sp = url.split("#");

    if (sp[1] == path) {
      //window.location.assign = arr.templateUrl;

      //execute controller
      if (arr.controller) {
        this.controll = arr.controller;
      }
      /*  http.ajax({
          method: "GET",
          url: arr.templateUrl,
          success: function (data) {
            //document.getElementById("s-view").innerHTML = data;
            document.getElementsByTagName("s-view")[0].innerHTML = data;
          }
        });
        */

      /**
       * Start
       */

      var xmlhttp;
      try {
        xmlhttp = new XMLHttpRequest();
      } catch (e) {
        try {
          xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
          try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (e) {
            console.log("Your browser not support ajax :(");
          }
        }
      }

      xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var res;
          res = xmlhttp.responseText;
          document.getElementsByTagName("s-view")[0].innerHTML = res;
          this.perser(this.query, this.data);
        }
      };
      xmlhttp.open("GET", arr.templateUrl, true);

      xmlhttp.send();

      /**
       * End
       */
    }

    return this;
  }

  /**
   * Show console error
   * @param {*} str
   */
  error(str) {
    console.error(str);
  }
  /**
   * Show console warn
   * @param {*} str
   */
  warn(str) {
    console.warn(str);
  }
  /**
   * Show console info
   * @param {*} str
   */
  info(str) {
    console.info(str);
  }
  //end console code
}

/**
 * Network class
 */
class http {
  /**
   * Perform ajax requests
   * @param {*} arr
   */
  static ajax({ method, url, data, success, dataType }) {
    var xmlhttp;
    try {
      xmlhttp = new XMLHttpRequest();
    } catch (e) {
      try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {
          console.log("Your browser not support ajax :(");
        }
      }
    }

    xmlhttp.onreadystatechange = function () {
      // if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      if (xmlhttp.readyState == 4) {
        var res;

        if (dataType == "json") {
          res = JSON.parse(xmlhttp.responseText);
        } else if (dataType == "text") {
          res = xmlhttp.responseText;
        } else {
          res = xmlhttp.responseText;
        }
        success(res);
      }
    };
    xmlhttp.open(method, url, true);

    if (data == false) {
      xmlhttp.send();
    } else {
      xmlhttp.send(data);
    }
  }
}

//data binding
function setModel(model, container) {
  var model = document.getElementById(model);
  var container = document.getElementById(container);

  if (model) {
    model.onkeyup = function () {
      container.innerHTML = model.value;
    };
  }
}

/**
 * Use javascript smartly
 * @param {*} selector
 */
function j(selector) {
  const self = {
    element: document.querySelector(selector),

    html: () => self.element,

    on: (event, callback) => {
      self.element.addEventListener(event, callback);
    },
    hide: () => {
      self.element.style.display = "none";
    },
    show: () => {
      self.element.style.display = "";
    },
    attr: (name, value) => {
      if (value == null) return self.element.getAttribute(name);
      else return self.element.setAttribute(name, value);
    },

    /**
     * Set image to target element
     */
    imageSet: (target) => {
      //handling image view
      var file = self.element.files[0];
      if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
          //set value of the input for profile picture
          self.attr("value", file.name);
          //display the image
          target.attr("src", e.target.result);
        };
        reader.readAsDataURL(file);
      }
      //end handling image view
    },
    //end image menopulation

    /**
     * Show nad Hide password
     */
    showPass: () => {
      var x = self.element;
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    },
    //end helper

    /**
     * Set Html Editor
     */
    beditor: (editorEl, { select: [] }) => {
      //create container
      const editorContainer = document.querySelector(editorEl);

      //editor menu
      // var editorMenu = document.createElement("div");
      // editorMenu.className = "editor-menu";
      // editorContainer.appendChild(editorMenu);

      //editor menu conainer
      var menuContainer = document.createElement("div");
      menuContainer.className = "editor-menu";
      editorContainer.appendChild(menuContainer);

      // create first manu row
      var editorMenuFirstRow = document.createElement("div");
      editorMenuFirstRow.className = "editor-menu";
      menuContainer.appendChild(editorMenuFirstRow);
      // create second manu row
      var editorMenuSecondRow = document.createElement("div");
      editorMenuSecondRow.className = "editor-menu";
      menuContainer.appendChild(editorMenuSecondRow);

      //button control for first row
      const firstRowMenu = [
        "bold",
        "italic",
        "underline",
        "unordered list",
        "ordered list",
        "picture",
        "link",
      ];
      for (var i = 0; i < firstRowMenu.length; i++) {
        var btn = document.createElement("button");
        btn.id = "btn-1-" + i;
        btn.type = "button";
        btn.innerText = firstRowMenu[i];
        btn.onclick = function (e) {
          const el = e.target.id;
          switch (el) {
            case "btn-1-0":
              document.execCommand("bold");
              saveChange();
              break;
            case "btn-1-1":
              document.execCommand("italic");
              saveChange();
              break;
            case "btn-1-2":
              document.execCommand("underline");
              saveChange();
              break;
            case "btn-1-3":
              document.execCommand("insertUnorderedList");
              saveChange();
              break;
            case "btn-1-4":
              document.execCommand("insertOrderedList");
              saveChange();
              break;
            case "btn-1-5":
              // document.execCommand(
              //   "insertImage",
              //   false,
              //   "http://usefulangle.com/img/posts/17-1px.jpg"
              // );
              var url = prompt("Enter the link here: ", "http://");
              document.execCommand("insertImage", false, url);
              saveChange();
              break;
            case "btn-1-6":
              var url = prompt("Enter the link here: ", "http://");
              document.execCommand("createlink", false, url);
              saveChange();
              break;

            default:
              break;
          }
        };
        // editorMenu.appendChild(btn);
        editorMenuFirstRow.appendChild(btn);
      }

      //button control for second row
      const secondRowMenu = [
        { el: "button", type: "button", label: "h1" },
        { el: "button", type: "button", label: "h2" },
        { el: "button", type: "button", label: "h3" },
        { el: "button", type: "button", label: "h4" },
        { el: "button", type: "button", label: "h5" },
        { el: "button", type: "button", label: "h6" },
      ];

      for (var i = 0; i < secondRowMenu.length; i++) {
        var el = document.createElement(secondRowMenu[i].el);
        el.id = "btn-2-" + i;
        el.innerHTML = secondRowMenu[i].label;
        el.type = secondRowMenu[i].type;
        el.onclick = function (e) {
          const el = e.target.id;
          switch (el) {
            case "btn-2-0":
              document.execCommand("formatBlock", false, "h1");
              saveChange();
              break;
            case "btn-2-1":
              document.execCommand("formatBlock", false, "h2");
              saveChange();
              break;
            case "btn-2-2":
              document.execCommand("formatBlock", false, "h3");
              saveChange();
              break;
            case "btn-2-3":
              document.execCommand("formatBlock", false, "h4");
              saveChange();
              break;
            case "btn-2-4":
              document.execCommand("formatBlock", false, "h5");
              saveChange();
              break;
            case "btn-2-5":
              document.execCommand("formatBlock", false, "h6");
              saveChange();
              break;

            default:
              break;
          }
        };
        editorMenuSecondRow.appendChild(el);
      }

      //editor setup
      var editor = document.createElement("div");
      editor.id = "b-editor";
      editor.className = "editor-text";
      editor.setAttribute("contenteditable", "true");
      editor.setAttribute("role", "textbox");
      editor.setAttribute("aria-multiline", "true");
      editor.spellcheck = "true";
      editorContainer.appendChild(editor);

      // data binding
      //j('#b-editor').element.innerHTML = self.element.innerHTML;
      j("#b-editor").element.innerHTML = self.element.value;
      self.element.setAttribute("hidden", "hidden");

      j("#b-editor").on("keyup", function () {
        //self.element.value = j('#b-editor').element.innerHTML;
        self.element.innerHTML = j("#b-editor").element.innerHTML;
      });

      self.element.addEventListener("keyup", function () {
        j("#b-editor").element.innerHTML = self.element.value;
        //self.element.innerHTML = j('#b-editor').element.innerHTML;
      });
      // set data to target element
      function saveChange() {
        self.element.innerHTML = j("#b-editor").element.innerHTML;
      }

      //operations
      //header
      /*
      document.querySelector('#h1-button').addEventListener('click', function() {
        document.execCommand('formatBlock', false, 'h1');
      });
      */
    },
    //end rich text editor

    //Stylesheet
    color: (value) => {
      self.element.style.color = value;
    },

    background: (value) => {
      self.element.style.background = value;
    },

    css: (name, value) => {
      var col = ":";
      self.element.style = name + col + value;
    },
    //endStyleSheet

    //Effect
    fadeIn: (time) => {
      var sel = selector.replace("#", "");

      var el = document.getElementById(sel);
      // document.getElementById('h').innerHTML =el
      el.style.opacity = 0;

      var last = +new Date();
      var tick = function () {
        el.style.opacity = +el.style.opacity + (new Date() - last) / time;
        last = +new Date();

        if (+el.style.opacity < 1) {
          (window.requestAnimationFrame && requestAnimationFrame(tick)) ||
            setTimeout(tick, 16);
        }
      };

      tick();
    },

    fadeOut: (time) => {
      var sel = selector.replace("#", "");

      el = document.getElementById(sel);
      el.style.opacity = 1;

      var last = +new Date();
      var tick = function () {
        el.style.opacity = +el.style.opacity - (new Date() - last) / time;
        last = +new Date();

        if (+el.style.opacity > 0) {
          (window.requestAnimationFrame && requestAnimationFrame(tick)) ||
            setTimeout(tick, 16);
        }
      };

      tick();
    },
    toggleSlide: (time) => {
      var minheight = 20;
      var maxheight = 300;
      //var time = 1000;
      var timer = null;
      var toggled = false;

      //function toggleSlide(time) {
      //time = 1000;
      var controler = document.getElementById("slide");
      var slider = document.getElementById("slider");
      slider.style.height = minheight + "px";
      controler.onclick = function () {
        clearInterval(timer);
        var instanceheight = parseInt(slider.style.height);
        var init = new Date().getTime();
        var height = (toggled = !toggled) ? maxheight : minheight;

        var disp = height - parseInt(slider.style.height);
        timer = setInterval(function () {
          var instance = new Date().getTime() - init;
          if (instance < time) {
            var pos = Math.floor((disp * instance) / time);
            result = instanceheight + pos;
            slider.style.height = result + "px";
            document.getElementById("log").innerHTML =
              "Current Height : <b>" +
              result +
              "</b><br /> Current Time : <b>" +
              instance +
              "</b>";
          } else {
            slider.style.height = height + "px"; //safety side ^^
            clearInterval(timer);
            controler.value = toggled ? " Slide Up " : " Slide Down ";
            document.getElementById("log").innerHTML =
              "Current Height : <b>" +
              height +
              "</b><br /> Current Time : <b>" +
              time +
              "</b>";
          }
        }, 1);
      };
      //};
    },
    //End effect
  };
  return self;
}

// Example library calls
/*
$('h1').attr('class', 'new-class')


$('h2').hide()



$('h3').on('click', function()
{
  alert("I was clicked")
})
*/
