var Icon = (function () {
    function Icon() {
        /**
         * @input {string} Specifies the label to use for accessibility. Defaults to the icon name.
         */
        this.ariaLabel = '';
        /**
         * @input {string} Specifies which icon to use. The appropriate icon will be used based on the mode.
         * For more information, see [Ionicons](/docs/ionicons/).
         */
        this.name = '';
        /**
         * @input {string} Specifies which icon to use on `ios` mode.
         */
        this.ios = '';
        /**
         * @input {string} Specifies which icon to use on `md` mode.
         */
        this.md = '';
        this.svgContent = null;
    }
    Object.defineProperty(Icon.prototype, "iconName", {
        get: function () {
            // if no name was passed set iconName to null
            if (!this.name) {
                return null;
            }
            var iconName = this.name.toLowerCase();
            // default to "md" if somehow the mode wasn't set
            var mode = this.mode || 'md';
            if (!(/^md-|^ios-|^logo-/.test(iconName))) {
                // this does not have one of the defaults
                // so lets auto add in the mode prefix for them
                iconName = mode + '-' + iconName;
            }
            else if (this.ios && mode === 'ios') {
                // if an icon was passed in using the ios or md attributes
                // set the iconName to whatever was passed in
                // when we're also on that mode
                // basically, use the ios attribute when you're on ios
                iconName = this.ios;
            }
            else if (this.md && mode === 'md') {
                // use the md attribute when you're in md mode
                // and the md attribute has been set
                iconName = this.md;
            }
            // only allow alpha characters and dash
            var invalidChars = iconName.replace(/[a-z]|-/g, '');
            if (invalidChars !== '') {
                console.error("invalid characters in ion-icon name: " + invalidChars);
                return null;
            }
            return iconName;
        },
        enumerable: true,
        configurable: true
    });
    Icon.prototype.hostData = function () {
        var attrs = {
            'role': 'img'
        };
        if (this.ariaLabel) {
            // user provided label
            attrs['aria-label'] = this.ariaLabel;
        }
        else {
            // come up with the label based on the icon name
            var iconName = this.iconName;
            if (iconName) {
                attrs['aria-label'] = iconName
                    .replace('ios-', '')
                    .replace('md-', '')
                    .replace(/\-/g, ' ');
            }
        }
        return {
            attrs: attrs
        };
    };
    Icon.prototype.render = function () {
        var _this = this;
        if (this.isServer) {
            return h("div", { "c": { "icon-inner": true } });
        }
        var svgUrl = getSvgUrl(this.iconName);
        if (!svgUrl) {
            // we don't have good data
            return h("div", { "c": { "icon-inner": true } });
        }
        var svgContent = svgContents[svgUrl];
        if (svgContent === this.svgContent) {
            // we've already loaded up this svg at one point
            // and the svg content we've loaded and assigned checks out
            // render this svg!!
            return h("div", { "c": { "icon-inner": true }, "p": { "innerHTML": svgContent } });
        }
        // haven't loaded this svg yet
        // start the request
        loadSvgContent(svgUrl, function (loadedSvgContent) {
            // we're finished loading the svg content!
            // set to this.svgContent so we do another render
            _this.svgContent = loadedSvgContent;
        });
        // actively requesting the svg, so let's just render a div for now
        return h("div", { "c": { "icon-inner": true } });
    };
    return Icon;
}());
export { Icon };
function getSvgUrl(iconName) {
    if (iconName !== null) {
        return publicPath + "svg/" + iconName + ".svg";
    }
    return null;
}
function loadSvgContent(svgUrl, callback) {
    // static since all IonIcons use this same function and pointing at global/shared data
    // passed in callback will have instance info
    // add to the list of callbacks to fiure when this url is finished loading
    loadCallbacks[svgUrl] = loadCallbacks[svgUrl] || [];
    loadCallbacks[svgUrl].push(callback);
    if (activeRequests[svgUrl]) {
        // already requesting this url, don't bother again kicking off another
        return;
    }
    // add this url to our list of active requests
    activeRequests[svgUrl] = true;
    // kick off the request for the external svg file
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function () {
        // awesome, we've finished loading the svg file
        // remove this url from the active requests
        delete activeRequests[svgUrl];
        // this response is the content of the svg file we're looking for
        var svgContent = this.responseText;
        if (this.status >= 400) {
            // umm, not awesome, something is up
            console.error('Icon could not be loaded:', svgUrl);
            svgContent = "<!--error loading svg-->";
        }
        // cache the svg content in the global IonIcon constant
        svgContents[svgUrl] = svgContent;
        // find any callbacks waiting on this url
        var svgLoadCallbacks = loadCallbacks[svgUrl];
        if (svgLoadCallbacks) {
            // loop through all the callbacks that are waiting on the svg content
            svgLoadCallbacks.forEach(function (cb) {
                // fire off this callback which was provided by an instance
                cb(svgContent);
            });
            delete loadCallbacks[svgUrl];
        }
    });
    xhr.addEventListener('error', function () {
        // umm, idk
        console.error('Icon could not be loaded:', svgUrl);
    });
    // let's do this!
    xhr.open('GET', svgUrl, true);
    xhr.send();
}
var activeRequests = {};
var loadCallbacks = [];
var svgContents = {};
