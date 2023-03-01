Data.once("WhileDataLoading", () => {
    FAQ.init();
});


class FAQ
{
    static #mainContent = null;
    static #loaded = false;
    
    static get isLoaded ()
    {
        return this.#loaded;
    }
    
    static Set ()
    {
        for (let i = 0; i < data.faq.length; i++)
        {
            const question = document.createElement("strong");
            const answer = document.createElement("div");
            
            question.classList.add("faq-question");
            question.append(data.faq[i].question);
            
            answer.classList.add("faq-answer", "quote");
            answer.append(data.faq[i].answer);
            
            this.#mainContent.append(question, answer);
        }
        
        this.#loaded = true;
    }
    
    static async init ()
    {
        this.#mainContent = document.querySelector("#faq");
        
        const faqResponse = await fetch("/data/faq.json");
        
        data.faq = await faqResponse.json();
        
        this.Set();
    }
}