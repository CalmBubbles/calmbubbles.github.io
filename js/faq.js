Data.once("WhileDataLoading", () => {
    FAQ.();
});


class FAQ
{
    static #mainContent = null;
    static #loaded = false;
    
    static get isLoaded ()
    {
        return this.#loaded;
    }
    
    static setFAQ ()
    {
        for (let i = 0; i < data.faq.length; i++)
        {
            let question = document.createElement("h3");
            let answer = document.createElement("div");
            
            question.classList.add("faq-question");
            question.append(data.faq[i].question);
            
            answer.classList.add("faq-answer", "quote");
            answer.append(data.faq[i].answer);
            
            this.#mainContent.append(question, answer);
        }
        
        this.#loaded = true;
    }
    
    static async Set ()
    {
        this.#mainContent = document.querySelector("#faq");
        
        let faqResponse = await fetch("/data/faq.json");
        
        data.faq = await faqResponse.json();
        
        this.setFAQ();
    }
}