/**
 * Max width : full
 * Min width : 220px
 */


Data.Once("OnDataLoad", () => {
    CodeOutputs.Set();
});


class CodeOutputs
{
    static #outputs = [];
    
    static #frames = null;
    
    static #Managed = class
    {
        #loadedOnce = false;
        #currentScale = 1;
        
        #codeOutput = null
        #codeFrame = null;
        
        constructor (id, source, refreshable, width, height, relHeight, scale)
        {
            this.src = source;
            this.width = width;
            this.height = height;
            this.relHeight = relHeight;
            this.initialScale = scale ?? 1;
            
            this.#codeOutput = document.querySelector(`#codeOutput_${id}`);
            
            if (refreshable)
            {
                const refreshElement = document.createElement("div");
                
                refreshElement.classList.add("textbtn", "coderefresh");
                refreshElement.textContent = "Run";
                
                refreshElement.onclick = () => {
                    this.RunOutput();
                    
                    refreshElement.onclick = () => { this.#codeFrame.contentWindow.location.href = this.src; };
                    
                    refreshElement.textContent = "Reset";
                };
                
                this.#codeOutput.append(refreshElement);
            }
            else this.RunOutput();
        }
        
        RunOutput ()
        {
            if (this.#loadedOnce) return;
            
            let sizeElement = [
                document.createElement("div"),
                document.createElement("div")
            ];
            
            sizeElement[0].classList.add("textbtn", "codedec");
            sizeElement[1].classList.add("textbtn", "codeinc");
            
            sizeElement[0].append("Size -");
            sizeElement[1].append("Size +");
            
            sizeElement[0].onclick = () => this.SizeDown();
            sizeElement[1].onclick = () => this.SizeUp();
            
            const frameElement = document.createElement("div");
            this.#codeFrame = document.createElement("iframe");
            
            frameElement.classList.add("codeframe");
            
            this.#codeFrame.src = this.src;
            
            if (this.width != null)
            {
                if (this.width === "full") this.#codeOutput.style.width = "85%";

                this.#codeFrame.style.width = this.width === "full" ? "100%" : this.width;
            }

            if (this.relHeight != null) Loop.Append(() => this.#codeFrame.style.height = `${this.#codeFrame.clientWidth * this.relHeight * 0.01}px`);
            else if (this.height != null) this.#codeFrame.style.height = this.height;
            
            frameElement.append(this.#codeFrame);
            
            const srcLink = document.createElement("a");
            
            srcLink.href = this.src;
            
            srcLink.append("Source↗");
            
            this.#codeOutput.append(sizeElement[0], sizeElement[1], frameElement, srcLink);
            
            this.RescaleTo(this.initialScale);
            
            this.#loadedOnce = true;
        }
        
        RescaleTo (value)
        {
            this.#currentScale = value;
            
            if (value < 1) this.#codeFrame.style.transformOrigin = "center";
            else if (value > 1) this.#codeFrame.style.transformOrigin = "0 0";
            
            this.#codeFrame.style.transform = `scale(${value}, ${value})`;
            
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
            
            this.#codeOutput.querySelector(".codedec").onclick = () => this.SizeDown();
            this.#codeOutput.querySelector(".codeinc").onclick = () => this.SizeUp();
            
            this.#codeOutput.querySelector(".codedec").style.cursor = "pointer";
            this.#codeOutput.querySelector(".codeinc").style.cursor = "pointer";
            
            this.#codeOutput.querySelector(".codedec").style.background = "black";
            this.#codeOutput.querySelector(".codeinc").style.background = "black";
        }
        
        SizeDown ()
        {
            this.RescaleTo(this.#currentScale - 0.125);
        }
        
        SizeUp ()
        {
            this.RescaleTo(this.#currentScale + 0.125);
        }
    }
    
    static Set ()
    {
        this.#frames = document.querySelectorAll(".codeoutputframe");
        
        for (let i = 0; i < this.#frames.length; i++)
        {
            while (this.#frames[i].firstChild != null) this.#frames[i].firstChild.remove();
            
            this.#frames[i].id = `codeOutput_${i}`;
            
            const source = this.#frames[i].getAttribute("data-src");
            const refreshable = this.#frames[i].getAttribute("data-refreshable") ?? false;
            const width = this.#frames[i].getAttribute("data-width");
            const height = this.#frames[i].getAttribute("data-height");
            const relHeight = this.#frames[i].getAttribute("data-relHeight");
            const scale = this.#frames[i].getAttribute("data-scale");
            
            this.#outputs.push(new this.#Managed(i, source, refreshable, width, height, relHeight, scale));
        }
    }
}
//supyer bago beh