window.onload = () => {
    loadScene();
    
    Data.Set();
    
    screenTrans.Start();
    
    Header.SetData();
};

function loadScene ()
{
    var currentPage = document.title;
    
    if (currentPage == "FAQ | CalmBubbles")
    {
        FAQ.load();
    }
}


// ----------Screen Transition
function screenTrans ()
{
    ThrowError(1);
}

screenTrans.Start = function ()
{
    this.body = document.body;
    this.fadeEl = document.querySelector(".fadeObject");
    this.fadeTime = 1;
    
    this.fadeEl.style.opacity = "0.0";
    this.fadeEl.style.transition = `opacity ${0.25 * this.fadeTime}s`;
    
    setTimeout(() => {
        this.fadeEl.style.pointerEvents = "none";
        this.fadeEl.style.transition = "none";
        
        this.body.style.overflowY = "visible";
    }, (250 * this.fadeTime));
    
    setInterval(() => { this.ScanAnchors(); }, 16.67);
};

screenTrans.ScanAnchors = function ()
{
    let pageAnc = document.querySelectorAll("a:not([target='_blank'])");
    
    for (let i = 0; i < pageAnc.length; i++)
    {
        var valid = true;
        
        for (let c = 0; c < pageAnc[i].href.length; c++)
        {
            if (pageAnc[i].href[c] == "#") valid = false;
        }
        
        if (valid)
        {
            pageAnc[i].onclick = e => {
                e.preventDefault();
                let target = pageAnc[i].href;
                
                this.body.style.overflowY = "hidden";
                
                this.fadeEl.style.pointerEvents = "all";
                this.fadeEl.style.opacity = "1.0";
                this.fadeEl.style.transition = `opacity ${0.25 * this.fadeTime}s`;
                
                setTimeout(() => {
                    window.location.href = target;
                }, (250 * this.fadeTime));
            };
        }
    }
};


// ----------Header
function Header ()
{
    ThrowError(1);
}

// -----Set Header
Header.SetData = function ()
{
    this.header = document.querySelector("header");
    this.main = document.querySelector("main");
    this.mainTop = this.main.style.top;
    
    this.main.style.minHeight = "calc(100vh - (125 * var(--pixel-unit))";
    
    this.enabled = true;
    
    setInterval(() => {
        if (this.scrollPos < window.pageYOffset)
        {
            if (!Menu.enabled) this.Toggle(false);
        }
        else if (this.scrollPos > window.pageYOffset)
        {
            this.Toggle(true);
        }
        
        this.scrollPos = window.pageYOffset;
    }, 16.67);
};

// -----Toggling
Header.Toggle = function (state)
{
    if (this.enabled == state) return;
    
    if (!state)
    {
        this.header.style.transform = "translateY(-100%)";
        this.header.style.transition = "transform 0.25s";
        this.main.style.top = "34px";
        this.main.style.minHeight = "calc(100vh - 62px)";
        this.main.style.transition = "top 0.25s";
    }
    else
    {
        this.header.style.transform = "none";
        this.header.style.transition = "transform 0.25s";
        this.main.style.top = this.mainTop;
        this.main.style.minHeight = "calc(100vh - (125 * var(--pixel-unit))";
        this.main.style.transition = "top 0.25s";
    }
    
    this.enabled = state;
}


// ----------Menu
function Menu ()
{
    ThrowError(1);
}

// -----Set Menu
Menu.SetData = function ()
{
    this.navData = document.createElement("div");
    this.listCount = 0;
    
    this.navData.id = "menuNav";
    
    for (let i = 0; i < data.menuList.length; i++)
    {
        var link = "/coming-soon";
        var subOutput;
        
        switch (data.menuList[i].type)
        {
            case "link":
                let aObject = document.createElement("a");
                let divObject = document.createElement("div");
                
                if (data.menuList[i].content != null)
                {
                    link = data.menuList[i].content;
                }
                
                aObject.href = link;
                
                divObject.classList.add("menuList");
                divObject.innerHTML = data.menuList[i].name;
                
                aObject.append(divObject);
                this.navData.append(aObject);
                break;
            case "list":
                if (data.menuList[i].content != null)
                {
                    subOutput = document.createElement("div");
                    subOutput.id = `menuDropdown_${this.listCount}`;
                    subOutput.classList.add("menuDropdown");
                    
                    for (let l = 0; l < data.menuList[i].content.length; l++)
                    {
                        let aObject = document.createElement("a");
                        let divObject = document.createElement("div");
                        
                        if (data.menuList[i].content[l].link != null)
                        {
                            link = data.menuList[i].content[l].link;
                        }
                        
                        aObject.href = link;
                        
                        divObject.classList.add("menuSubList");
                        divObject.innerHTML = data.menuList[i].content[l].name;
                        
                        aObject.append(divObject);
                        subOutput.append(aObject);
                        
                        if (l == data.menuList[i].content.length - 1)
                        {
                            let menuList = document.createElement("div");
                            let dropDiv = document.createElement("div");
                            let dropImg = document.createElement("img");
                            
                            menuList.id = `menuList_${this.listCount}`;
                            menuList.classList.add("menuList");
                            menuList.innerHTML = data.menuList[i].name;
                            
                            dropImg.classList.add("unselectable");
                            dropImg.src = "/img/spr_menuDropdown.png";
                            dropImg.alt = data.menuList[i].name;
                            
                            dropDiv.append(dropImg);
                            menuList.append(dropDiv);
                            this.navData.append(menuList, subOutput);
                            
                            this.listCount++;
                        }
                    }
                }
                break;
        }
        
        if (i == data.menuList.length - 1)
        {
            this.body = document.body;
            this.main = document.querySelector("main");
            this.btnMenu = document.querySelector("#btnMenu");
            this.btnMenuImg = document.querySelector("img");
            
            this.btnMenu.onclick = () => { this.Toggle(); };
        }
    }
};

// -----Toggling
Menu.Toggle = function ()
{
    if (this.enabled == null) this.enabled = false;
    
    if (this.btnMenu.onclick != null) this.btnMenu.onclick = () => { };
    
    if (!Header.enabled) Header.Toggle(true);
    
    if (!this.enabled)
    {
        this.body.style.overflowY = "hidden";
        
        this.btnMenuImg.style.transform = "translate(calc(-480 * var(--pixel-unit)), 0)";
        this.btnMenuImg.style.transition = "transform steps(8) 0.5s";
        
        let newMenu = document.createElement("div");
        let menuSocials = document.createElement("div");
        
        let aSocialBtn = [
            document.createElement("a"),
            document.createElement("a"),
            document.createElement("a")
        ];
        
        let imgSocialBtn = [
            document.createElement("img"),
            document.createElement("img"),
            document.createElement("img")
        ];
        
        let divSiteInfo = document.createElement("div");
        let aSiteInfo = document.createElement("a");
        let newOverlay = document.createElement("hr");
        
        newMenu.id = "menu";
        menuSocials.id = "menuSocials";
        
        aSocialBtn[0].href = data.socials.youtube;
        aSocialBtn[1].href = data.socials.twitter;
        aSocialBtn[2].href = data.socials.instagram;
        
        for (let i = 0; i < aSocialBtn.length; i++)
        {
            aSocialBtn[i].target = "_blank";
            aSocialBtn[i].rel = "noreferrer noopener";
        }
        
        imgSocialBtn[0].id = "menuBtnYt";
        imgSocialBtn[1].id = "menuBtnTwt";
        imgSocialBtn[2].id = "menuBtnInsta";
        
        for (let i = 0; i < imgSocialBtn.length; i++)
        {
            imgSocialBtn[i].classList.add("unselectable");
            imgSocialBtn[i].src = data.sprites.socials;
            
            aSocialBtn[i].append(imgSocialBtn[i]);
            menuSocials.append(aSocialBtn[i]);
        }
        
        divSiteInfo.id = "menuSiteInfo";
        
        aSiteInfo.href = "/site-info";
        aSiteInfo.innerHTML = "&#9432; About this site";
        
        divSiteInfo.append(aSiteInfo);
        
        newOverlay.id = "menuOverlay";
        
        newMenu.append(this.navData, menuSocials, divSiteInfo);
        this.main.append(newMenu, newOverlay);
        
        this.menu = this.main.querySelector("#menu");
        this.overlay = this.main.querySelector("#menuOverlay");
        
        for (let i = 0; i < this.listCount; i++)
        {
            let onloadFunc = Function(`Menu.managed_${i} = new menuManaged("${i}");`);
            onloadFunc();
        }
        
        this.menu.style.transform = "none";
        this.menu.style.transition = "transform 0.5s";
        this.overlay.style.background = "rgba(0, 0, 0, 0.37)";
        this.overlay.style.transition = "background 0.5s";
        
        
        setTimeout(() => {
            this.btnMenuImg.style.transition = "none";
            this.menu.style.transition = "none";
            this.overlay.style.transition = "none";
            
            this.enabled = !this.enabled;
            this.btnMenu.onclick = () => { this.Toggle(); };
            this.overlay.onclick = () => { this.Toggle(); };
        }, 500);
    }
    else
    {
        this.btnMenuImg.style.transform = "none";
        this.btnMenuImg.style.transition = "transform steps(8) 0.25s";
        
        for (let i = 0; i < this.listCount; i++)
        {
            let onloadFunc = Function(`if (Menu.managed_${i}.enabled) { Menu.managed_${i}.Toggle(); }`);
            onloadFunc();
        }
        
        this.menu.style.transform = "translateX(-100%)";
        this.menu.style.transition = "transform 0.25s";
        this.overlay.style.background = "none";
        this.overlay.style.transition = "background 0.25s";
        
        setTimeout(() => {
            this.btnMenuImg.style.transition = "none";
            
            this.menu.remove();
            this.overlay.remove();
            
            this.body.style.overflowY = "visible";
            
            this.enabled = !this.enabled;
            this.btnMenu.onclick = () => { this.Toggle(); };
        }, 250);
    }
};

// -----Managed Class for Sublists
class menuManaged
{
    constructor (id)
    {
        this.thisObj = document.querySelector(`#menuList_${id}`);
        this.arrowImg = this.thisObj.querySelector("img");
        this.dropdown = document.querySelector(`#menuDropdown_${id}`)
        
        this.ddHeight = this.dropdown.scrollHeight;
        
        this.thisObj.onclick = () => { this.Toggle(); };
    }
    
    Toggle ()
    {
        if (this.enabled == null) this.enabled = false;
        
        if (this.thisObj.onclick != null) this.thisObj.onclick = null;
        
        if (!this.enabled)
        {
            this.arrowImg.style.transform = "translate(calc(-480 * var(--pixel-unit)), 0)";
            this.arrowImg.style.transition = "transform steps(8) 0.25s";
            this.dropdown.style.maxHeight = `${this.ddHeight}px`;
            this.dropdown.style.transition = "max-height 0.25s";
            
            setTimeout(() => {
                this.arrowImg.style.transition = "none";
                this.dropdown.style.transition = "none";
                
                this.enabled = !this.enabled;
                this.thisObj.onclick = () => { this.Toggle(); };
            }, 250);
        }
        else
        {
            this.arrowImg.style.transform = "none";
            this.arrowImg.style.transition = "transform steps(8) 0.25s";
            this.dropdown.style.maxHeight = "0";
            this.dropdown.style.transition = "max-height 0.25s";
            
            setTimeout(() => {
                this.arrowImg.style.transition = "none";
                this.dropdown.style.transition = "none";
                
                this.enabled = !this.enabled;
                this.thisObj.onclick = () => { this.Toggle(); };
            }, 250);
        }
    }
}


// ----------Data
var data;

function Data ()
{
    ThrowError(1);
}

Data.Set = function ()
{
    let request = new XMLHttpRequest();
    
    request.onload = () => {
        if (request.status < 400)
        {
            data = JSON.parse(request.responseText);
            
            this.checkSiteIndex();
        }
    };
    
    request.onerror = () => {
        ThrowError(3);
    };
    
    request.open("GET", "/data/data.json");
    request.overrideMimeType("application/json");
    request.send();
};

Data.checkSiteIndex = function ()
{
    let siteIndex = parseInt(document.body.getAttribute("data-siteIndex"));
    
    switch (siteIndex)
    {
        case 0:
            this.afterLoad();
            break;
        case 1:
            let request = new XMLHttpRequest();
            
            request.onload = () => {
                if (request.status < 400)
                {
                    data.menuList = JSON.parse(request.responseText).menuList;
                    
                    this.afterLoad();
                }
            };
            
            request.onerror = () => {
                ThrowError(3);
            };
            
            request.open("GET", "/data/data-js-plugins.json");
            request.overrideMimeType("application/json");
            request.send();
            break;
    }
};

Data.afterLoad = function ()
{
    Menu.SetData();
};


// ----------Debugging
function ThrowError (errorCode)
{
    var errorText;
    
    switch (errorCode)
    {
        case 0:
            errorText = "Value was unassigned or invalid";
            break;
        case 1:
            errorText = "Using static class as a function";
            break;
        case 2:
            errorText = "There is no instance to work with";
            break;
        case 3:
            errorText = "File or source is invalid";
            break;
    }
    
    errorText += `\nError Code: ${errorCode}`;
    
    alert(errorText);
    console.error(errorText);
    throw new Error(errorText);
}