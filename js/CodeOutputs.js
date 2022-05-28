window.addEventListener("load", () => {
    CodeOutputs.scan();
});


// ----------Code Outputs
function CodeOutputs ()
{
    ThrowError(1);
}

CodeOutputs.scan = function ()
{
    this.codeframes = document.querySelectorAll(".codeoutputframe");
    
    for (let i = 0; i < this.codeframes.length; i++)
    {
        this.codeframes[i].id = `codeOutput_${i}`;
        
        let onloadFunc = Function(`CodeOutputs.managed_${i} = new codeOutputManaged("${i}", "${this.codeframes[i].getAttribute("data-src")}", ${this.codeframes[i].getAttribute("data-refreshable") ?? false}, "${this.codeframes[i].getAttribute("data-width")}", "${this.codeframes[i].getAttribute("data-height")}", ${this.codeframes[i].getAttribute("data-scale")});`);
        onloadFunc();
    }
};


// -----Managed Class for CodeOutputs
class codeOutputManaged
{
    constructor (id, source, refreshable, width, height, scale)
    {
        this.src = source;
        this.width = width || null;
        this.height = height || null;
        this.initialScale = scale ?? 1.0;
        
        this.codeOutput = document.querySelector(`#codeOutput_${id}`);
        
        if (refreshable)
        {
            let refreshElement = document.createElement("div");
            
            refreshElement.classList.add("codebtn", "coderefresh");
            refreshElement.innerHTML = "Run";
            
            refreshElement.onclick = () => {
                this.runOutput();
                
                refreshElement.onclick = () => { this.codeFrame.contentWindow.location.href = this.src; };
                
                refreshElement.innerHTML = "Reset";
            };
            
            this.codeOutput.append(refreshElement);
        }
        else this.runOutput();
    }
    
    runOutput ()
    {
        var sizeElement = [
            document.createElement("div"),
            document.createElement("div")
        ];
        
        sizeElement[0].classList.add("codebtn", "codedec");
        sizeElement[1].classList.add("codebtn", "codeinc");
        
        sizeElement[0].innerHTML = "Size -";
        sizeElement[1].innerHTML = "Size +";
        
        sizeElement[0].onclick = () => { this.sizeDown(); };
        sizeElement[1].onclick = () => { this.sizeUp(); };
        
        this.codeOutput.append(sizeElement[0], sizeElement[1]);
        
        var frameElement = document.createElement("div");
        var iframeElement = document.createElement("iframe");
        
        frameElement.classList.add("codeframe");
        
        iframeElement.src = this.src;
        
        if (this.width != null) iframeElement.style.width = this.width;
        
        if (this.height != null) iframeElement.style.height = this.height;
        
        frameElement.append(iframeElement);
        this.codeOutput.append(frameElement);
        
        this.codeFrame = this.codeOutput.querySelector("iframe");
        
        this.resizeTo(this.initialScale);
    }
    
    resizeTo (value)
    {
        this.currentScale = value;
        
        this.codeFrame.style.transform = `scale(${value}, ${value})`;
        
        if (this.currentScale == 0.125)
        {
            this.codeOutput.querySelector(".codedec").onclick = () => { };
            
            this.codeOutput.querySelector(".codedec").style.cursor = "default";
            
            this.codeOutput.querySelector(".codedec").style.background = "rgba(0, 0, 0, 0.50)";
        }
        else if (this.currentScale == 2.0)
        {
            this.codeOutput.querySelector(".codeinc").onclick = () => { };
            
            this.codeOutput.querySelector(".codeinc").style.cursor = "default";
            
            this.codeOutput.querySelector(".codeinc").style.background = "rgba(0, 0, 0, 0.50)";
        }
        else
        {
            this.codeOutput.querySelector(".codedec").onclick = () => { this.sizeDown(); };
            this.codeOutput.querySelector(".codeinc").onclick = () => { this.sizeUp(); };
            
            this.codeOutput.querySelector(".codedec").style.cursor = "pointer";
            this.codeOutput.querySelector(".codeinc").style.cursor = "pointer";
            
            this.codeOutput.querySelector(".codedec").style.background = "black";
            this.codeOutput.querySelector(".codeinc").style.background = "black";
        }
    }
    
    sizeDown ()
    {
        this.resizeTo(this.currentScale - 0.125);
    }
    
    sizeUp ()
    {
        this.resizeTo(this.currentScale + 0.125);
    }
}