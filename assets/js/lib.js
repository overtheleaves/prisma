function setDefault(x, d) {
    return x === undefined ? d : x;
}

function getLinkNode(node, root) {
    if (!node || node === root) return;
    if ('a' !== node.nodeName.toLowerCase() || !node.href) {
        return getLinkNode(node.parentNode, root);
    }
    return node;
}

function LocalRouter(contentRootId, rootElement) {
    var self = this;
    var contentRootElement = document.getElementById(contentRootId);

    self.routes = {};
    self.rootElement = setDefault(rootElement, document.documentElement);
    self.contentRootId = contentRootId;
    self.contentRootElement = setDefault(contentRootElement, document.contentRootElement);

    self.rootElement.addEventListener('click', function(e) {
        if (e.defaultPrevented) return;
        if (e.button && e.button !== 0) return;

        var node = getLinkNode(e.target, self.rootElement);

        if (!node) return;
        if (!self.hasRoute(node.pathname)) return;

        self.doRoute(node.pathname);
        e.preventDefault();
    });
}

LocalRouter.prototype.addRoute = function (pathname, realPathname) {
    this.routes[pathname] = new Route(pathname, realPathname);
};

LocalRouter.prototype.hasRoute = function (pathname) {
    return this.routes[pathname] !== undefined
};

LocalRouter.prototype.doRoute = function (pathname) {

    if (pathname === undefined || pathname == null || pathname === '') {
        console.error('LocalRouter has no route information: ' + pathname)
    }

    var req = new XMLHttpRequest();
    var self = this;

    req.open('GET', this.routes[pathname].realPathname, true);
    req.onreadystatechange = function (aEvt) {
        if (req.readyState === 4) {
            if(req.status === 200) {
                var div = document.createElement('div');
                div.innerHTML = req.responseText;
                self.contentRootElement.innerHTML = div.querySelector('#' + self.contentRootId).innerHTML;

                history.pushState({}, "title", pathname);
            } else {
                console.error('Error loading page ' + pathname);
            }
        }
    };

    req.send(null);
}

function Route(pathname, realPathname) {
    this.pathname = pathname;
    this.realPathname = realPathname;
}
