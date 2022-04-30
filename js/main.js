window.onload = () => {
    Menu.SetData();
};

function Menu ()
{
    ThrowError(1);
}

Menu.SetData = function ()
{
    /*let request = new XMLHttpRequest();
    
    request.onload = () => {
        if (request.status < 400)
        {
            this.menuData = JSON.parse(request.responseText);*/
            
            this.main = document.querySelector("main");
            this.btnMenu = document.querySelector("#btnMenu");
            this.btnMenuImg = btnMenu.querySelector("img");
            
            this.btnMenu.onclick = () => { this.Toggle(); };
        /*}
    };
    
    request.onerror = () => {
        ThrowError(3);
    };
    
    request.open("GET", "/data/menuList.json");
    request.overrideMimeType("application/json");
    request.send();*/
};

Menu.Toggle = function ()
{
    if (this.enabled == null) this.enabled = false;
    
    if (this.btnMenu.onclick != null) this.btnMenu.onclick = null;
    
    if (!this.enabled)
    {
        this.btnMenuImg.style.animation = "btnMenu steps(8) 0.5s";
        
        this.main.innerHTML += `<div id="menu"></div><hr id="menuOverlay">`;
        this.menu = this.main.querySelector("#menu");
        this.overlay = this.main.querySelector("#menuOverlay");
        this.menu.style.animation = "slideX 0.5s";
        this.overlay.style.animation = "menuOverlay 0.5s";
        
        setTimeout(() => {
            this.btnMenuImg.style.animation = "none";
            this.btnMenuImg.style.transform = "translate(calc(-480 * var(--pixel-unit)), 0)";
            
            this.menu.style.animation = "none";
            this.overlay.style.animation = "none";
            
            this.enabled = !this.enabled;
            this.btnMenu.onclick = () => { this.Toggle(); };
            this.overlay.onclick = () => { this.Toggle(); };
        }, 500);
    }
    else
    {
        this.btnMenuImg.style.animation = "reverse btnMenu steps(8) 0.25s";
        
        this.menu.style.animation = "reverse slideX 0.25s";
        this.overlay.style.animation = "reverse menuOverlay 0.25s";
        
        setTimeout(() => {
            this.btnMenuImg.style.animation = "none";
            this.btnMenuImg.style.transform = "none";
            
            this.menu.remove();
            this.overlay.remove();
            
            this.enabled = !this.enabled;
            this.btnMenu.onclick = () => { this.Toggle(); };
        }, 250);
    }
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