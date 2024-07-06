window.addEventListener("load", () => {
    AutoScroll.Set();
});


class AutoScroll
{
    static #loaded = false;
    static #scrollHeight = 0;
    static #yOffset = 0;
    
    static get #bodyHeight ()
    {
        return document.body.scrollHeight;
    }
    
    static get #docOffset ()
    {
        return 3 + document.documentElement.clientHeight + window.pageYOffset;
    }
    
    static #RequestUpdate ()
    {
        requestAnimationFrame(this.#Update.bind(this));
    }
    
    static #Update ()
    {
        const newScroll = this.#bodyHeight;
        
        if (this.#scrollHeight >= newScroll || this.#yOffset < this.#scrollHeight)
        {
            this.#RequestUpdate();
            
            return;
        }
        
        this.#scrollHeight = newScroll;
        
        window.scroll({ top : this.#scrollHeight });
        
        this.#RequestUpdate();
    }
    
    static Set ()
    {
        if (this.#loaded) return;
        
        this.#scrollHeight = this.#bodyHeight;
        this.#yOffset = this.#docOffset;
        
        this.#RequestUpdate();
        
        window.addEventListener("scroll", () => { this.#yOffset = this.#docOffset; });
        
        this.#loaded = false;
    }
}