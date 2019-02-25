;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-mima1" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M385.150849 385.662338l-128.895105 0 0-150.377622q0-49.102897 19.436563-91.556444t53.706294-74.677323 80.815185-50.637363 101.786214-18.413586q49.102897 0 94.625375 18.413586t80.815185 50.637363 56.263736 74.677323 20.971029 91.556444l0 150.377622-123.78022 0 0-121.734266q0-64.447552-35.804196-99.74026t-97.182817-35.292707q-55.240759 0-88.999001 35.292707t-33.758242 99.74026l0 121.734266zM826.053946 447.040959q27.62038 0 47.568432 19.948052t19.948052 47.568432l0 317.122877q0 27.62038-9.718282 51.66034t-26.597403 41.942058-39.896104 28.131868-50.637363 10.22977l-516.603397 0q-27.62038 0-50.125874-10.22977t-38.361638-27.108891-24.551449-39.384615-8.695305-48.07992l0-324.283716q0-27.62038 19.436563-47.568432t47.056943-19.948052l61.378621 0 128.895105 0 255.744256 0 123.78022 0 61.378621 0z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-yonghu" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M851.981205 709.929932c-54.201459-70.837348-124.107599-107.469664-242.228857-119.240755-21.311375-4.291746-37.381375-23.184025-37.381375-45.616944 0-16.427134 52.704362-65.599044 52.329832-65.963341 54.391794-56.255235 83.550904-147.665131 83.550904-217.936591 0-109.151979-87.849814-197.748806-196.251709-197.748806s-196.251709 88.597851-196.251709 197.748806c0 70.656223 28.41005 162.612565 83.36057 218.8678 0 0 52.521191 48.604998 52.521191 65.032132 0 23.747867-17.941628 43.552935-41.123606 46.361911-115.692952 12.157901-184.842869 48.588625-238.487649 118.494765-15.515369 20.189831-23.930015 60.744479-24.486694 82.431408 0.183172 5.601578 0 93.453439 0 93.453439 0 41.304731 33.455973 74.760704 74.762751 74.760704l579.410296 0c41.306778 0 74.762751-33.455973 74.762751-74.760704 0 0-0.183172-87.85186 0-93.453439C875.91122 770.675434 867.496573 730.119763 851.981205 709.929932z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<css>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</css>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)