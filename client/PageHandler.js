﻿window.DEBUGs = true;
window.DEBUGLABELS = [];

function PageHandler() {







    var self = this;
    window.PageHandler = this;



    window.PageHandler.socket = io.connect('http://li428-241.members.linode.com:82');
    window.PageHandler.socket2 = io.connect('http://li428-241.members.linode.com:81');


    window.PageHandler.socket.on('Area.Main.Login.Response', function (data) {
        alert(JSON.stringify(data));
        debugger;

    });
    window.PageHandler.socket.on('Area.Lobby.ListCardGames.Response', function (question) {
        window.PageHandler.socket.emit('Area.Game.AnswerQuestion', { value: 1 });
    });
    window.PageHandler.socket.on('Area.Lobby.ListRooms.Response', function (data) {
        console.log(data);
    });

    window.PageHandler.socket.emit('Area.Main.Login.Request', { user: 'dested' });


    window.PageHandler.socket2.on('Area.Game.RoomInfo', function (data) {
        alert(JSON.stringify(data));
        debugger;
    });
    window.PageHandler.socket2.emit('Area.Game.Create', { user: { name: 'dested' } });
    
    var uiCanvas;

    $('body').append(uiCanvas = document.createElement('canvas'));
    $(uiCanvas).css({ margin: '0px', position: 'absolute', top: '0px', left: '0px', 'z-index': 0 });

    self.uiContext = uiCanvas.getContext("2d");
    self.uiContext.canvas = uiCanvas;
    self.uiContext.$canvas = $(uiCanvas);

    self.uiContext.canvas.width = $(window).width();
    self.uiContext.canvas.height = $(window).height();

    this.lastMouseMove = false;

    uiCanvas.addEventListener('DOMMouseScroll', self.handleScroll.bind(self), false);
    uiCanvas.addEventListener('mousewheel', self.handleScroll.bind(self), false);

    uiCanvas.addEventListener('touchmove', self.canvasMouseMove.bind(self));
    uiCanvas.addEventListener('touchstart', self.canvasOnClick.bind(self));
    uiCanvas.addEventListener('touchend', self.canvasMouseUp.bind(self));

    uiCanvas.addEventListener('mousedown', self.canvasOnClick.bind(self));
    uiCanvas.addEventListener('mouseup', self.canvasMouseUp.bind(self));
    uiCanvas.addEventListener('mousemove', self.canvasMouseMove.bind(self));

    uiCanvas.addEventListener('contextmenu', function (evt) {
        evt.preventDefault();
        //special right click menu;
    }, false);

    $(window).resize(self.resizeCanvas);
    self.uiManager = new UIManager(self.uiContext);
    self.resizeCanvas();

    window.setInterval(self.draw.bind(self), 1000 / 60);

    $(document).keydown(function (e) {
        self.uiManager.onKeyDown(e);
    });

    return this;
}

PageHandler.prototype.canvasOnClick = function (e) {
    e.preventDefault();
    if (this.uiManager.onClick(e)) return false;
    return false;
};
PageHandler.prototype.canvasMouseMove = function (e) {
    e.preventDefault();
    document.body.style.cursor = "default";
    this.lastMouseMove = e;
    if (this.uiManager.onMouseMove(e)) return false;
    return false;
};
PageHandler.prototype.canvasMouseUp = function (e) {
    e.preventDefault();
    this.uiManager.onMouseUp(this.lastMouseMove);
    return false;
};
PageHandler.prototype.handleScroll = function (e) {
    e.preventDefault();

    if (this.uiManager.onMouseScroll(e)) return false;

    return e.preventDefault() && false;
};


PageHandler.prototype.resizeCanvas = function () {
    this.uiContext.$canvas.attr("width", $(window).width());
    this.uiContext.$canvas.attr("height", $(window).height());
};

PageHandler.prototype.draw = function () {
    cHelp.clearCanvas(this.uiContext.canvas);
    this.uiManager.draw(this.uiContext);

    this.uiContext.save();
    for (var i = 0; i < window.DEBUGLABELS.length; i++) {
        this.uiContext.fillStyle = "#ffffff";
        this.uiContext.font = "16pt Arial bold";
        this.uiContext.fillText(window.DEBUGLABELS[i], 200, i * 30 + 100);
    }

    this.uiContext.restore();

};