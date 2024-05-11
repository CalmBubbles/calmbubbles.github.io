window.onload = () => {
    Loop.Init();
    Data.Init();
};


class Data
{
    static #loaded = false;
    static #events = [];
    
    static #event = null;
    
    static menuList = [];
    static socials = { };
    static html = {
        body : null,
        main : null
    };
    
    static get isLoaded ()
    {
        return this.#loaded;
    }
    
    static get currentEvent ()
    {
        return this.#event;
    }
    
    static #CompareMethod (lhs, rhs)
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
    
    static #AddEvent (event, callback, recallable)
    {
        const listener = {
            event : event,
            callback : callback,
            recallable : recallable
        };
        
        const index = this.#events.indexOf(listener);
        
        if (index < 0) this.#events.push(listener);
        else this.#events.splice(index, 1);
    }
    
    static GetCurrentPage ()
    {
        const location = window.location.toString().split("/");
        
        let end = location.length;
        
        if (location[end - 1].endsWith(".html")) location[end - 1] = location[end - 1].slice(0, -5);
        
        if (location[end - 1] === "index") end--;
        
        let output = "";
        
        for (let i = 0; i < end; i++)
        {
            output += location[i];
            
            if (i < end - 1 || end < 4) output += "/";
        }
        
        return output;
    }
    
    static On (event, callback)
    {
        this.#AddEvent(event, callback, true);
    }
    
    static Once (event, callback)
    {
        this.#AddEvent(event, callback, false);
    }
    
    static async #CallEvent (event)
    {
        this.#event = event;
        
        const events = this.#events.filter(item => item.event === event);
        
        for (let i = 0; i < events.length; i++)
        {
            await events[i].callback();
            
            if (!events[i].recallable) this.#events.splice(this.#events.indexOf(events[i]), 1);
        }
        
        this.#event = null;
    }
    
    static async Image (src)
    {
        const img = await fetch(src);
        const blob = await img.blob();
        
        return await URL.createObjectURL(blob);
    }
    
    static async Init ()
    {
        if (this.#loaded) return;
        
        this.html.body = document.body;
        this.html.main = document.querySelector("main");
        
        await this.#CallEvent("WhileDataLoading");
        
        const dataRequest = await fetch("/data/data.json");
        const data = await dataRequest.json();
        
        const dataSrc = data.menus[parseInt(document.body.getAttribute("data-site") ?? 0) - 1];
        
        if (dataSrc == null) this.menuList = data.menuList;
        else if (dataSrc.endsWith(".json"))
        {
            const siteRequest = await fetch(`/data/${dataSrc}`);
            
            this.menuList = await siteRequest.json();
        }
        else
        {
            const siteRequest = await fetch(`/data/${dataSrc}/data.json`);
            const siteData = await siteRequest.json();
            
            const menuRequest = await fetch(`/data/${dataSrc}/${siteData[parseInt(document.body.getAttribute("data-menu") ?? 0)]}.json`);
            
            this.menuList = await menuRequest.json();
        }
        
        this.socials = data.socials;
        
        this.#loaded = true;
        
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        await this.#CallEvent("OnDataLoad");
    }
}

class Loop
{
    static #loaded = false;
    static #frameIndex = 0;
    static #uTime = 0;
    static #uDeltaTime = 0;
    static #time = 0;
    static #deltaTime = 0;
    static #calls = [];
    
    static targetFrameRate = 60;
    static timeScale = 1;
    static maximumDeltaTime = 0.06666667;
    
    static get frameCount ()
    {
        return this.#frameIndex;
    }
    
    static get unscaledTime ()
    {
        return this.#uTime;
    }
    
    static get unscaledDeltaTime ()
    {
        return this.#uDeltaTime;
    }
    
    static get time ()
    {
        return this.#time;
    }
    
    static get deltaTime ()
    {
        return this.#deltaTime;
    }
    
    static #RequestUpdate ()
    {
        requestAnimationFrame(this.#Update.bind(this));
    }
    
    static #Update ()
    {
        const slice = (1 / this.targetFrameRate) - 5e-3;
        
        let accumulator = (1e-3 * performance.now()) - this.#uTime;
        
        while (accumulator >= slice)
        {
            this.#uDeltaTime = (1e-3 * performance.now()) - this.#uTime;
            this.#uTime += this.#uDeltaTime;
            
            let deltaT = this.#uDeltaTime;
            
            if (deltaT > this.maximumDeltaTime) deltaT = this.maximumDeltaTime;
            
            this.#deltaTime = deltaT * this.timeScale;
            this.#time += this.#deltaTime;
            
            this.#Invoke();
            
            if (this.timeScale !== 0) this.#frameIndex++;
            
            accumulator -= slice;
        }
        
        this.#RequestUpdate();
    }
    
    static #Invoke ()
    {
        for (let i = 0; i < this.#calls.length; i++)
        {
            const currentCall = this.#calls[i];
            
            currentCall.time += this.#deltaTime;
            
            if (currentCall.time <= currentCall.timeout) continue;
            
            currentCall.callback();
            
            if (currentCall.clear()) this.#calls.splice(this.#calls.indexOf(currentCall), 1);
            else currentCall.time = 0;
        }
    }
    
    static Init ()
    {
        if (this.#loaded) return;
        
        this.#loaded = true;
        
        this.#RequestUpdate();
    }
    
    static Append (callback, delay, shouldClear)
    {
        this.#calls.push({
            callback : callback,
            clear : shouldClear ?? (() => false),
            timeout : delay ?? 0,
            time : 0
        });
    }
    
    static async Delay (time)
    {
        if (time === 0) return;
        
        let done = false;
        
        return new Promise(resolve => this.Append(() => {
            done = true;
            
            resolve();
        }, time, () => done));
    }
}

class Background
{
    static #loaded = false;
    
    static Set ()
    {
        if (this.#loaded) return;
        
        this.#loaded = true;
        
        Loop.Append(() => this.Update());
    }
    
    static Update ()
    {
        if (this.innerHeight === window.innerHeight && this.scrollHeight === Data.html.body.scrollHeight) return;
        
        this.innerHeight = window.innerHeight;
        this.scrollHeight = Data.html.body.scrollHeight;
        
        const newTime = (60 - (1 - this.scrollHeight / this.innerHeight) * 60) / Loop.timeScale;
        
        Data.html.main.style.animation = `${newTime}s linear bg infinite`;
        Data.html.body.style.animation = `${newTime}s linear body infinite`;
    }
}

class Header
{
    static #loaded = false;
    static #enabled = true;
    static #scrollPos = 0;
    static #mainTop = "";
    
    static #header = null;
    
    static get isEnabled ()
    {
        return this.#enabled;
    }
    
    static Set ()
    {
        if (this.#loaded) return;
        
        this.#header = document.querySelector("header");
        this.#mainTop = Data.html.main.style.top;
        this.#scrollPos = window.pageYOffset;
        
        Data.html.main.style.minHeight = "calc(100vh - (125 * var(--pixel-unit))";
        
        this.#loaded = true;
        
        Loop.Append(() => this.Update());
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
            Data.html.main.style.top = "34px";
            Data.html.main.style.minHeight = "calc(100vh - 62px)";
        }
        else
        {
            this.#header.style.transform = "none";
            Data.html.main.style.top = this.#mainTop;
            Data.html.main.style.minHeight = "calc(100vh - (125 * var(--pixel-unit))";
        }
        
        const time = 0.25 / Loop.timeScale;
        
        this.#header.style.transition = `transform ${time}s`;
        Data.html.main.style.transition = `top ${time}s`;
        
        this.#enabled = state;
    }
}

class Menu
{
    static #loaded = false;
    static #enabled = false;
    static #dropdowns = [];
    
    static #menu = null;
    static #overlay = null;
    static #btnImg = null;
    
    static get isEnabled ()
    {
        return this.#enabled;
    }
    
    static async Set ()
    {
        if (this.#loaded) return;
        
        this.#menu = document.createElement("div");
        this.#overlay = document.createElement("hr");
        
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
        
        this.#menu.id = "menu";
        menuSocials.id = "menuSocials";
        
        aSocialBtn[0].href = Data.socials.youtube;
        aSocialBtn[1].href = Data.socials.twitter;
        aSocialBtn[2].href = Data.socials.instagram;
        
        imgSocialBtn[0].id = "menuBtnYt";
        imgSocialBtn[1].id = "menuBtnTwt";
        imgSocialBtn[2].id = "menuBtnInsta";
        
        const socialImg = await Data.Image("/img/socials.png");
        
        for (let i = 0; i < 3; i++)
        {
            aSocialBtn[i].target = "_blank";
            aSocialBtn[i].rel = "noreferrer noopener";
            
            imgSocialBtn[i].classList.add("unselectable");
            imgSocialBtn[i].src = socialImg;
            
            aSocialBtn[i].append(imgSocialBtn[i]);
            menuSocials.append(aSocialBtn[i]);
        }
        
        divSiteInfo.id = "menuSiteInfo";
        
        aSiteInfo.href = "/site-info";
        
        aSiteInfo.append("About this site");
        
        divSiteInfo.append(aSiteInfo);
        
        this.#overlay.id = "menuOverlay";
        
        const navData = document.createElement("div");
        
        navData.id = "menuNav";
        
        const dropImg = await Data.Image("/img/menuDropdown.png");
        
        for (let i = 0; i < Data.menuList.length; i++)
        {
            const item = Data.menuList[i];
            
            if (Array.isArray(item.content))
            {
                if (item.content.length === 0) continue;
                
                const listObject = document.createElement("div");
                const dropObject = document.createElement("div");
                
                this.#dropdowns.push(new MenuDropdown(listObject, dropObject, item, dropImg));
                
                navData.append(listObject, dropObject);
                
                continue;
            }
            
            const aObject = document.createElement("a");
            const divObject = document.createElement("div");
            
            aObject.href = item.content ?? "/coming-soon";
            
            if (item.content != null && aObject.href === Data.GetCurrentPage()) aObject.classList.add("currentPage");
            
            divObject.classList.add("menuList");
            divObject.append(item.name);
            
            aObject.append(divObject);
            navData.append(aObject);
        }
        
        this.#menu.append(navData, menuSocials, divSiteInfo);
        
        const menuSection = Data.html.body.querySelector("#menuSection");
        
        menuSection.append(this.#menu, this.#overlay);
        
        const btn = document.querySelector("#btnMenu");
        this.#btnImg = btn.querySelector("img");
        
        this.#loaded = true;
        
        this.#overlay.onclick = () => this.Toggle();
        
        btn.onclick = () => this.Toggle();
    }
    
    static async Toggle ()
    {
        if (!this.#loaded) return;
        
        this.#enabled = !this.#enabled;
        
        if (!Header.isEnabled) Header.Toggle(true);
        
        const uTime = this.#enabled ? 0.5 : 0.25;
        const time = uTime / Loop.timeScale;
        
        Data.html.body.setAttribute("data-scrollable", this.#enabled ? "menu" : "true");
        
        if (!this.#enabled)
        {
            for (let i = 0; i < this.#dropdowns.length; i++)
            {
                if (this.#dropdowns[i].isEnabled && !this.#dropdowns[i].currentPage) this.#dropdowns[i].Toggle();
            }
        }
        
        this.#btnImg.style.transition = `transform steps(6) ${time}s`;
        this.#menu.style.transition = `transform ${time}s`;
        this.#overlay.style.transition = `opacity ${time}s`;
        
        Data.html.main.style.transition = `max-width ${time}s, transform ${time}s`;
        
        await Loop.Delay(uTime);
        
        this.#btnImg.style.transition = "initial";
        this.#menu.style.transition = "initial";
        this.#overlay.style.transition = "initial";
        
        Data.html.main.style.transition = "initial";
    }
}

class MenuDropdown
{
    #enabled = false;
    #height = 0;
    
    #dropdown = null;
    #arrowImg = null;
    
    currentPage = false;
    
    get isEnabled ()
    {
        return this.#enabled;
    }
    
    constructor (targetObj, dropObj, item, dropImg)
    {
        this.#dropdown = dropObj;
        
        targetObj.classList.add("menuList");
        
        const title = document.createElement("span");
        const arrowDiv = document.createElement("div");
        
        this.#arrowImg = document.createElement("img");
        
        title.append(item.name);
        
        this.#arrowImg.classList.add("unselectable");
        this.#arrowImg.src = dropImg;
        this.#arrowImg.alt = item.name;
        
        arrowDiv.append(this.#arrowImg);
        targetObj.append(title, arrowDiv);
        
        this.#dropdown.classList.add("menuDropdown");
        
        for (let i = 0; i < item.content.length; i++)
        {
            const aObject = document.createElement("a");
            const divObject = document.createElement("div");
            
            let link = null;
            let name = null;
            
            if (typeof item.content[i] === "string")
            {
                link = `${item.dir ?? ""}${item.content[i]}`;
                name = item.content[i];
            }
            else
            {
                const iLink = item.content[i].link;
                
                if (iLink != null) link = `${item.dir ?? ""}${iLink}`;
                
                name = item.content[i].name;
            }
            
            aObject.href = link ?? "/coming-soon";
            
            if (link != null && aObject.href === Data.GetCurrentPage())
            {
                aObject.classList.add("currentPage");
                
                this.currentPage = true;
            }
            
            divObject.classList.add("menuSubList");
            divObject.append(name);
            
            aObject.append(divObject);
            this.#dropdown.append(aObject);
        }
        
        requestAnimationFrame(() => {
            this.#height = this.#dropdown.scrollHeight
            
            targetObj.onclick = () => this.Toggle();
            
            if (this.currentPage) this.Toggle();
        });
    }
    
    async Toggle ()
    {
        this.#enabled = !this.#enabled;
        
        const uTime = this.#enabled ? 0.25 : 0.125;
        const time = uTime / Loop.timeScale;
        
        if (this.#enabled)
        {
            this.#arrowImg.style.transform = "translateX(calc(-225.882352941 * var(--pixel-unit)))";
            this.#dropdown.style.maxHeight = `${this.#height}px`;
        }
        else
        {
            this.#arrowImg.style.transform = "none";
            this.#dropdown.style.maxHeight = "0";
        }
        
        this.#arrowImg.style.transition = `transform steps(4) ${time}s`;
        this.#dropdown.style.transition = `max-height ${time}s`;
        
        await Loop.Delay(uTime);
        
        this.#arrowImg.style.transition = "none";
        this.#dropdown.style.transition = "none";
    }
}

class ScreenTrans
{
    static #loaded = false;
    
    static #fadeEl = null;
    
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
                
                Data.html.body.setAttribute("data-scrollable", "false");
                
                this.#fadeEl.style.pointerEvents = "initial";
                this.#fadeEl.style.opacity = "1";
                this.#fadeEl.style.transition = `opacity ${0.25 / Loop.timeScale}s`;
                
                await Loop.Delay(0.25);
                
                window.location.href = target;
            };
        }
    }
    
    static async Set ()
    {
        if (this.#loaded) return;
        
        this.#fadeEl = document.querySelector(".fadeObject");
        
        this.#fadeEl.style.opacity = "0";
        this.#fadeEl.style.transition = `opacity ${0.25 / Loop.timeScale}s`;
        
        await Loop.Delay(0.25);
        
        this.#fadeEl.style.pointerEvents = "none";
        this.#fadeEl.style.transition = "initial";
        
        Data.html.body.setAttribute("data-scrollable", "true");
        
        this.#loaded = true;
        
        this.ScanAnchors();
        
        Loop.Append(() => this.ScanAnchors(), 0.5);
    }
}


Data.Once("WhileDataLoading", () => {
    Background.Set();
    Header.Set();
});

Data.Once("OnDataLoad", async () => {
    await Menu.Set();
    
    await ScreenTrans.Set();
    
    if (window.innerWidth < 1025) return;
    
    Menu.Toggle();
    
    const currentPage = document.querySelector("#menu .currentPage");
    
    currentPage.style.outline = "0";
    
    currentPage.focus();
});