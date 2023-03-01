window.onload = () => {
    Data.Set();
};


var data = {
    siteIndex : 0,
    html : {
        body : null,
        main : null
    },
    menuList : null,
    socials : null,
    faq : null,
    get performance () {
        if (performance.now() < 500) return performance.now() / 2;
        
        return 0;
    },
    delay : async (time) => {
        return new Promise(resolve => setTimeout(resolve, time + data.performance));
    }
};


class Data
{
    static #loaded = false;
    static #events = [];
    static #event = null;
    
    static get isLoaded ()
    {
        return this.#loaded;
    }
    
    static get currentEvent ()
    {
        return this.#event;
    }
    
    static #compareMethod (lhs, rhs)
    {
        const lS = `${lhs}`;
        const rS = `${rhs}`;
        
        let a = "";
        let b = "";
        
        for (let i = 0; i < lS.length; i++)
        {
            if (lS[i] === "\n") continue;
            if (lS[i - 1] === " " && lS[i] === " ") continue;
            if (lS[i + 1] === " " && lS[i] === " ") continue;
            if (lS[i - 1] === "{" && lS[i] === " ") continue;
            if (lS[i + 1] === "}" && lS[i] === " ") continue;
            if (lS[i - 1] === "(" && lS[i] === " ") continue;
            if (lS[i + 1] === ")" && lS[i] === " ") continue;
            if (lS[i - 1] === "," && lS[i] === " ") continue;
            if (lS[i + 1] === "," && lS[i] === " ") continue;
            
            a += lS[i];
        }
        
        for (let i = 0; i < rS.length; i++)
        {
            if (rS[i] === "\n") continue;
            if (rS[i - 1] === " " && rS[i] === " ") continue;
            if (rS[i + 1] === " " && rS[i] === " ") continue;
            if (rS[i - 1] === "{" && rS[i] === " ") continue;
            if (rS[i + 1] === "}" && rS[i] === " ") continue;
            if (rS[i - 1] === "(" && rS[i] === " ") continue;
            if (rS[i + 1] === ")" && rS[i] === " ") continue;
            if (rS[i - 1] === "," && rS[i] === " ") continue;
            if (rS[i + 1] === "," && rS[i] === " ") continue;
            
            b += rS[i];
        }
        
        return a === b;
    }
    
    static on (event, callback)
    {
        if (event == null || callback == null) throw new Error("Data needed for js-plugins class method 'countdown.on' is undefined");
        
        const listener = {
            event : event,
            callback : callback,
            recallable : true,
            called : false
        };
        
        for (let iA = 0; iA < this.#events.length; iA++)
        {
            const equalEvent = listener.event === this.#events[iA].event;
            const equalMethod = this.#compareMethod(listener.callback, this.#events[iA].callback);
            const equalRecall = listener.recallable === this.#events[iA].recallable;
            
            if (equalEvent && equalMethod && equalRecall)
            {
                let newEvents = [];
                
                for (let iB = 0; iB < this.#events.length; iB++)
                {
                    if (iB === iA) continue;
                    
                    if (newEvents.length === 0) newEvents[0] = this.#events[iB];
                    else newEvents.push(this.#events[iB]);
                }
                
                this.#events = newEvents;
                
                return;
            }
        }
        
        if (this.#events.length === 0) this.#events[0] = listener;
        else this.#events.push(listener);
    }
    
    static once (event, callback)
    {
        if (event == null || callback == null) throw new Error("Data needed for js-plugins class method 'countdown.once' is undefined");
        
        const listener = {
            event : event,
            callback : callback,
            recallable : false,
            called : false
        };
        
        for (let iA = 0; iA < this.#events.length; iA++)
        {
            const equalEvent = listener.event === this.#events[iA].event;
            const equalMethod = this.#compareMethod(listener.callback, this.#events[iA].callback);
            const equalRecall = listener.recallable === this.#events[iA].recallable;
            
            if (equalEvent && equalMethod && equalRecall)
            {
                let newEvents = [];
                
                for (let iB = 0; iB < this.#events.length; iB++)
                {
                    if (iB === iA) continue;
                    
                    if (newEvents.length === 0) newEvents[0] = this.#events[iB];
                    else newEvents.push(this.#events[iB]);
                }
                
                this.#events = newEvents;
                
                return;
            }
        }
        
        if (this.#events.length === 0) this.#events[0] = listener;
        else this.#events.push(listener);
    }
    
    static async Set ()
    {
        let dataSrc = null;
        
        data.siteIndex = parseInt(document.body.getAttribute("data-siteIndex")) ?? 0;
        
        data.html.body = document.body;
        data.html.main = document.querySelector("main");
        
        const dataRequest = await fetch("/data/data.json");
        
        let newData = await dataRequest.json();
        
        switch (data.siteIndex)
        {
            case 1:
                dataSrc = "/data/js-plugins.json";
                break;
        }
        
        if (dataSrc != null)
        {
            const dataRequestExtend = await fetch(dataSrc);
            const newDataExtend = await dataRequestExtend.json();
            
            if (newDataExtend.menuList != null) newData.menuList = newDataExtend.menuList;
        }
        
        data.menuList = newData.menuList;
        data.socials = newData.socials;
        
        const socialImg = await fetch(data.socials.img);
        const socialImgBlob = await socialImg.blob();
        
        data.socials.imgCached = await URL.createObjectURL(socialImgBlob);
        
        this.#hasLoaded();
    }
    
    static async #callEvents ()
    {
        const event = this.#event;
        
        let mustRemove = null;
        
        for (let iA = 0; iA < this.#events.length; iA++)
        {
            const listener = this.#events[iA];
            const callable = listener.recallable || !listener.called;
            
            if (listener.event !== event) continue;
            
            if (!callable)
            {
                let newEvents = [];
                
                for (let iB = 0; iB < this.#events.length; iB++)
                {
                    if (iB === iA) continue;
                    
                    if (newEvents.length === 0) newEvents[0] = this.#events[iB];
                    else newEvents.push(this.#events[iB]);
                }
                
                this.#events = newEvents;
                
                continue;
            }
            
            await listener.callback();
            
            listener.called = true;
        }
    }
    
    static async #hasLoaded ()
    {
        this.#event = "WhileDataLoading";
        await this.#callEvents();
        
        this.#event = "OnDataLoad";
        await this.#callEvents();
        
        this.#event = null;
    }
    
}

class Loop
{
    static #loaded = false;
    static #calls = [];
    
    static #requestUpdate ()
    {
        requestAnimationFrame(this.#update.bind(this));
    }
    
    static #update ()
    {
        const currentCalls = this.#calls;
        
        for (let i = 0; i < currentCalls.length; i++) currentCalls[i]();
        
        this.#requestUpdate();
    }
    
    static init ()
    {
        if (this.#loaded) return;
        
        this.#loaded = true;
        
        this.#requestUpdate();
    }
    
    static append (callback)
    {
        if (this.#calls.length === 0) this.#calls[0] = callback;
        else this.#calls.push(callback);
    }
}

class Background
{
    static Set ()
    {
        Loop.append(() => { this.Update(); });
    }
    
    static Update ()
    {
        if (this.innerHeight === window.innerHeight && this.scrollHeight === data.html.body.scrollHeight) return;
        
        this.innerHeight = window.innerHeight;
        this.scrollHeight = data.html.body.scrollHeight;
        
        const newTime = 60 - (1 - this.scrollHeight / this.innerHeight) * 60;
        
        data.html.main.style.animation = `${newTime}s linear bg infinite`;
        data.html.body.style.animation = `${newTime}s linear body infinite`;
    }
}

class Header
{
    static #enabled = true;
    static #header = null;
    static #mainTop = null;
    static #scrollPos = null;
    
    static get isEnabled ()
    {
        return this.#enabled;
    }
    
    static Set ()
    {
        this.#header = document.querySelector("header");
        this.#mainTop = data.html.main.style.top;
        
        data.html.main.style.minHeight = "calc(100vh - (125 * var(--pixel-unit))";
        
        Loop.append(() => { this.Update(); });
    }
    
    static Update ()
    {
        if (this.#scrollPos < window.pageYOffset && !Menu.isEnabled) this.Toggle(false);
        else if (this.#scrollPos > window.pageYOffset) this.Toggle(true);
        
        this.#scrollPos = window.pageYOffset;
    }
    
    static Toggle (state)
    {
        if (this.#enabled === state) return;
        
        if (!state)
        {
            this.#header.style.transform = "translateY(-100%)";
            this.#header.style.transition = "transform 0.25s";
            data.html.main.style.top = "34px";
            data.html.main.style.minHeight = "calc(100vh - 62px)";
            data.html.main.style.transition = "top 0.25s";
        }
        else
        {
            this.#header.style.transform = "none";
            this.#header.style.transition = "transform 0.25s";
            data.html.main.style.top = this.#mainTop;
            data.html.main.style.minHeight = "calc(100vh - (125 * var(--pixel-unit))";
            data.html.main.style.transition = "top 0.25s";
        }
        
        this.#enabled = state;
    }
}

class Menu
{
    static #menuSection = null;
    static #navData = null;
    static #listIndex = 0;
    static #btnMenu = null;
    static #btnMenuImg = null;
    static #enabled = false;
    static #toggling = false;
    static #menu = null;
    static #overlay = null;
    static #dropdowns = [];
    
    static get listCount ()
    {
        return this.#listIndex;
    }
    
    static get isEnabled ()
    {
        return this.#enabled;
    }
    
    static #managed = class
    {
        #thisObj = null;
        #arrowImg = null;
        #dropdown = null;
        #ddHeight = null;
        #enabled = false;
        #toggling = false;
        
        get isEnabled ()
        {
            return this.#enabled;
        }
        
        constructor (id)
        {
            this.#thisObj = document.querySelector(`#menuList_${id}`);
            this.#arrowImg = this.#thisObj.querySelector("img");
            this.#dropdown = document.querySelector(`#menuDropdown_${id}`);
            
            this.#ddHeight = this.#dropdown.scrollHeight;
            
            this.#thisObj.onclick = () => { this.Toggle(); };
        }
        
        async Toggle ()
        {
            if (this.#toggling) return;
            
            this.#toggling = true;
            
            if (!this.#enabled)
            {
                this.#arrowImg.style.transform = "translate(calc(-480 * var(--pixel-unit)), 0)";
                this.#arrowImg.style.transition = "transform steps(8) 0.25s";
                this.#dropdown.style.maxHeight = `${this.#ddHeight}px`;
                this.#dropdown.style.transition = "max-height 0.25s";
            }
            else
            {
                this.#arrowImg.style.transform = "none";
                this.#arrowImg.style.transition = "transform steps(8) 0.25s";
                this.#dropdown.style.maxHeight = "0";
                this.#dropdown.style.transition = "max-height 0.25s";
            }
            
            await data.delay(250);
            
            this.#arrowImg.style.transition = "none";
            this.#dropdown.style.transition = "none";
            
            this.#enabled = !this.#enabled;
            
            this.#toggling = false;
        }
    }
    
    static Set ()
    {
        data.html.main.setAttribute("data-menuEnabled", "false");
        
        this.#menuSection = data.html.body.querySelector("#menuSection");
        this.#navData = document.createElement("div");
        this.#listIndex = 0;
        
        this.#navData.id = "menuNav";
        
        for (let iA = 0; iA < data.menuList.length; iA++)
        {
            let link = "/coming-soon";
            let subOutput;
            
            switch (data.menuList[iA].type)
            {
                case "link":
                    const aObject = document.createElement("a");
                    const divObject = document.createElement("div");
                    
                    if (data.menuList[iA].content != null) link = data.menuList[iA].content;
                    
                    aObject.href = link;
                    
                    divObject.classList.add("menuList");
                    divObject.append(data.menuList[iA].name);
                    
                    aObject.appendChild(divObject);
                    this.#navData.appendChild(aObject);
                    break;
                case "list":
                    if (data.menuList[iA].content == null) return;
                    
                    subOutput = document.createElement("div");
                    subOutput.id = `menuDropdown_${this.#listIndex}`;
                    subOutput.classList.add("menuDropdown");
                    
                    for (let iB = 0; iB < data.menuList[iA].content.length; iB++)
                    {
                        const aObject = document.createElement("a");
                        const divObject = document.createElement("div");
                        
                        if (data.menuList[iA].content[iB].link != null)
                        {
                            link = data.menuList[iA].content[iB].link;
                        }
                        
                        aObject.href = link;
                        
                        divObject.classList.add("menuSubList");
                        divObject.append(data.menuList[iA].content[iB].name);
                        
                        aObject.appendChild(divObject);
                        subOutput.appendChild(aObject);
                        
                        if (iB === data.menuList[iA].content.length - 1)
                        {
                            const menuList = document.createElement("div");
                            const dropDiv = document.createElement("div");
                            const dropImg = document.createElement("img");
                            
                            menuList.id = `menuList_${this.#listIndex}`;
                            menuList.classList.add("menuList");
                            menuList.append(data.menuList[iA].name);
                            
                            dropImg.classList.add("unselectable");
                            dropImg.src = "/img/spr_menuDropdown.png";
                            dropImg.alt = data.menuList[iA].name;
                            
                            dropDiv.appendChild(dropImg);
                            menuList.appendChild(dropDiv);
                            this.#navData.append(menuList, subOutput);
                            
                            this.#listIndex++;
                        }
                    }
                    break;
            }
            
            if (iA != data.menuList.length - 1) continue;
            
            this.#btnMenu = document.querySelector("#btnMenu");
            this.#btnMenuImg = document.querySelector("img");
            
            this.#btnMenu.onclick = () => { this.Toggle(); };
        }
    }
    
    static async Toggle ()
    {
        if (this.#toggling) return;
        
        this.#toggling = true;
        
        if (!Header.isEnabled) Header.Toggle(true);
        
        if (!this.#enabled)
        {
            data.html.body.setAttribute("data-scrollable", "false, menu");
            
            this.#btnMenuImg.style.transform = "translate(calc(-480 * var(--pixel-unit)), 0)";
            this.#btnMenuImg.style.transition = "transform steps(8) 0.5s";
            
            this.#menu = document.createElement("div");
            const menuSocials = document.createElement("div");
            
            const aSocialBtn = [
                document.createElement("a"),
                document.createElement("a"),
                document.createElement("a")
            ];
            
            const imgSocialBtn = [
                document.createElement("img"),
                document.createElement("img"),
                document.createElement("img")
            ];
            
            const divSiteInfo = document.createElement("div");
            const aSiteInfo = document.createElement("a");
            this.#overlay = document.createElement("hr");
            
            this.#menu.id = "menu";
            menuSocials.id = "menuSocials";
            
            aSocialBtn[0].href = data.socials.links.youtube;
            aSocialBtn[1].href = data.socials.links.twitter;
            aSocialBtn[2].href = data.socials.links.instagram;
            
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
                imgSocialBtn[i].src = data.socials.imgCached;
                
                aSocialBtn[i].appendChild(imgSocialBtn[i]);
                menuSocials.appendChild(aSocialBtn[i]);
            }
            
            divSiteInfo.id = "menuSiteInfo";
            
            aSiteInfo.href = "/site-info";
            aSiteInfo.innerHTML = "&#9432; About this site";
            
            divSiteInfo.appendChild(aSiteInfo);
            
            this.#overlay.id = "menuOverlay";
            
            this.#menu.append(this.#navData, menuSocials, divSiteInfo);
            this.#menuSection.append(this.#menu, this.#overlay);
            
            for (let i = 0; i < this.#listIndex; i++)
            {
                if (this.#dropdowns.length === 0) this.#dropdowns[0] = new this.#managed(i);
                else this.#dropdowns.push(new this.#managed(i));
            }
            
            this.#menu.style.transform = "none";
            this.#menu.style.transition = "transform 0.5s";
            this.#overlay.style.background = "rgba(0, 0, 0, 0.37)";
            this.#overlay.style.transition = "background 0.5s";
            
            data.html.main.setAttribute("data-menuEnabled", "true");
            
            data.html.main.style.transition = "max-width 0.5s, transform 0.5s";
            
            await data.delay(500);
            
            this.#btnMenuImg.style.transition = "initial";
            this.#menu.style.transition = "initial";
            this.#overlay.style.transition = "initial";
            
            data.html.main.style.transition = "initial";
            
            this.#enabled = true;
            
            this.#toggling = false;
            
            this.#btnMenu.onclick = () => { this.Toggle(); };
            this.#overlay.onclick = () => { this.Toggle(); };
            
            return;
        }
        
        this.#btnMenuImg.style.transform = "none";
        this.#btnMenuImg.style.transition = "transform steps(8) 0.25s";
        
        for (let i = 0; i < this.listCount; i++) if (this.#dropdowns[i].isEnabled) this.#dropdowns[i].Toggle();
        
        this.#menu.style.transform = "translateX(-100%)";
        this.#menu.style.transition = "transform 0.25s";
        this.#overlay.style.background = "none";
        this.#overlay.style.transition = "background 0.25s";
        
        data.html.main.setAttribute("data-menuEnabled", "false");
        
        data.html.main.style.transition = "max-width 0.25s, transform 0.25s";
        
        await data.delay(250);
        
        this.#btnMenuImg.style.transition = "none";
        
        this.#menu.remove();
        this.#overlay.remove();
        
        data.html.body.setAttribute("data-scrollable", "true");
        
        data.html.main.style.transition = "initial";
        
        this.#enabled = false;
        
        this.#toggling = false;
    }
}

class screenTrans
{
    static #clickedId = false;
    static #fadeEl = null;
    
    static fadeTime = 1;
    
    static get clickedIdAnchor ()
    {
        return this.#clickedId;
    }
    
    static async Set ()
    {
        this.#fadeEl = document.querySelector(".fadeObject");
        
        this.#fadeEl.style.opacity = "0.0";
        this.#fadeEl.style.transition = `opacity ${0.25 * this.fadeTime}s`;
        
        await data.delay(250 * this.fadeTime);
        
        this.#fadeEl.style.pointerEvents = "none";
        this.#fadeEl.style.transition = "initial";
        
        data.html.body.setAttribute("data-scrollable", "true");
        
        Loop.append(() => { this.ScanAnchors(); });
    }
    
    static ScanAnchors ()
    {
        const pageAnc = document.querySelectorAll("a:not([target='_blank'])");
        
        for (let iA = 0; iA < pageAnc.length; iA++)
        {
            let valid = true;
            
            for (let iB = 0; iB < pageAnc[iA].href.length; iB++) if (pageAnc[iA].href[iB] === "#") valid = false;
            
            if (!valid) return;
            
            pageAnc[iA].onclick = async e => {
                e.preventDefault();
                
                const target = pageAnc[iA].href;
                
                data.html.body.setAttribute("data-scrollable", "false");
                
                this.#fadeEl.style.pointerEvents = "all";
                this.#fadeEl.style.opacity = "1.0";
                this.#fadeEl.style.transition = `opacity ${0.25 * this.fadeTime}s`;
                
                await data.delay(250 * this.fadeTime);
                
                window.location.href = target;
            };
        }
    }
}


Data.once("OnDataLoad", () => {
    Background.Set();
    Header.Set();
    Menu.Set();
    
    screenTrans.Set();
});


function ThrowError (errorCode)
{
    let errorText;
    
    switch (errorCode)
    {
        case 0:
            errorText = "Value is unassigned or invalid";
            break;
        case 1:
            errorText = "No instance to work with";
            break;
        case 2:
            errorText = "File cannot be loaded";
            break;
    }
    
    errorText += `\nError Code: ${errorCode}`;
    
    alert(errorText);
    console.error(errorText);
    throw new Error(errorText);
}