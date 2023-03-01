Data.once("OnDataLoad", () => {
    CodeOutputs.Set();
});


class CodeOutputs
{
    static #frames = null;
    static #outputs = [];
    
    static #managed = class
    {
        #codeOutput = null
        #codeFrame = null;
        #currentScale = 1;
        
        constructor (id, source, refreshable, width, height, scale)
        {
            this.src = source;
            this.width = width;
            this.height = height;
            this.initialScale = scale ?? 1;
            
            this.#codeOutput = document.querySelector(`#codeOutput_${id}`);
            
            if (refreshable)
            {
                const refreshElement = document.createElement("div");
                
                refreshElement.classList.add("textbtn", "coderefresh");
                refreshElement.textContent = "Run";
                
                refreshElement.onclick = () => {
                    this.runOutput();
                    
                    refreshElement.onclick = () => { this.#codeFrame.contentWindow.location.href = this.src; };
                    
                    refreshElement.textContent = "Reset";
                };
                
                this.#codeOutput.appendChild(refreshElement);
            }
            
            this.runOutput();
        }
        
        runOutput ()
        {
            let sizeElement = [
                document.createElement("div"),
                document.createElement("div")
            ];
            
            sizeElement[0].classList.add("textbtn", "codedec");
            sizeElement[1].classList.add("textbtn", "codeinc");
            
            sizeElement[0].append("Size -");
            sizeElement[1].append("Size +");
            
            sizeElement[0].onclick = () => { this.sizeDown(); };
            sizeElement[1].onclick = () => { this.sizeUp(); };
            
            this.#codeOutput.append(sizeElement[0], sizeElement[1]);
            
            let frameElement = document.createElement("div");
            this.#codeFrame = document.createElement("iframe");
            
            frameElement.classList.add("codeframe");
            this.#codeFrame.src = this.src;
            
            if (this.width != null) this.#codeFrame.style.width = this.width;
            if (this.height != null) this.#codeFrame.style.height = this.height;
            
            frameElement.appendChild(this.#codeFrame);
            this.#codeOutput.appendChild(frameElement);
            
            this.resizeTo(this.initialScale);
        }
        
        resizeTo (value)
        {
            this.#currentScale = value;
            
            this.#codeFrame.style.transform = `scale(${value}, ${value})`;
            this.#codeFrame.style.transition = "transform 0.125s";
            
            switch (this.#currentScale)
            {
                case 0.125:
                    this.#codeOutput.querySelector(".codedec").onclick = () => { };
                    
                    this.#codeOutput.querySelector(".codedec").style.cursor = "default";
                    this.#codeOutput.querySelector(".codedec").style.background = "rgba(0, 0, 0, 0.50)";
                    return;
                case 2:
                    this.#codeOutput.querySelector(".codeinc").onclick = () => { };
                    
                    this.#codeOutput.querySelector(".codeinc").style.cursor = "default";
                    this.#codeOutput.querySelector(".codeinc").style.background = "rgba(0, 0, 0, 0.50)";
                    return;
            }
            
            this.#codeOutput.querySelector(".codedec").onclick = () => { this.sizeDown(); };
            this.#codeOutput.querySelector(".codeinc").onclick = () => { this.sizeUp(); };
            
            this.#codeOutput.querySelector(".codedec").style.cursor = "pointer";
            this.#codeOutput.querySelector(".codeinc").style.cursor = "pointer";
            
            this.#codeOutput.querySelector(".codedec").style.background = "black";
            this.#codeOutput.querySelector(".codeinc").style.background = "black";
        }
        
        sizeDown ()
        {
            this.resizeTo(this.#currentScale - 0.125);
        }
        
        sizeUp ()
        {
            this.resizeTo(this.#currentScale + 0.125);
        }
    }
    
    static Set ()
    {
        this.#frames = document.querySelectorAll(".codeoutputframe");
        
        for (let i = 0; i < this.#frames.length; i++)
        {
            this.#frames[i].id = `codeOutput_${i}`;
            
            const source = this.#frames[i].getAttribute("data-src");
            const refreshable = this.#frames[i].getAttribute("data-refreshable") ?? false;
            const width = this.#frames[i].getAttribute("data-width");
            const height = this.#frames[i].getAttribute("data-height");
            const scale = this.#frames[i].getAttribute("data-scale");
            
            if (this.#outputs.length === 0) this.#outputs[0] = new this.#managed(i, source, refreshable, width, height, scale);
            else this.#outputs.push(new this.#managed(i, source, refreshable, width, height, scale));
        }
    }
}
//supyer bago beh