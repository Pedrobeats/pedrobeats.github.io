module.exports = function(eleventyConfig) {
    // Copiar assets da pasta 'src/assets' para 'assets' na raiz
    eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

    // Shortcode para ano dinâmico
    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    // Coleção de Portfolio ordenada
    eleventyConfig.addCollection("portfolio", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/portfolio/*.md").sort(function(a, b) {
            return (b.date || 0) - (a.date || 0);
        });
    });

    // Coleção de Blog ordenada por data mais recente
    eleventyConfig.addCollection("blog", function(collectionApi) {
        return collectionApi.getFilteredByGlob("src/blog/*.md").sort(function(a, b) {
            return (b.date || 0) - (a.date || 0);
        });
    });

    // Filtro de data no formato brasileiro com timeZone UTC
    eleventyConfig.addFilter("brDate", function(value) {
        if (!value) return "";
        let dateObj;
        if (value instanceof Date) {
            dateObj = value;
        } else if (typeof value === "string") {
            const parts = value.split("-");
            if (parts.length === 3) {
                dateObj = new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)));
            } else {
                dateObj = new Date(value);
            }
        } else {
            dateObj = new Date(value);
        }
        return dateObj.toLocaleDateString("pt-BR", {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC'
        });
    });

    // Filtro para estimativa de tempo de leitura
    eleventyConfig.addFilter("readingTime", function(content) {
        if (!content) return "1 min";
        const wordsPerMinute = 200;
        const cleanContent = String(content).replace(/<[^>]*>/g, "");
        const wordCount = cleanContent.trim().split(/\s+/).filter(Boolean).length;
        const minutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
        return `${minutes} min de leitura`;
    });

    // Filtro para limitar arrays
    eleventyConfig.addFilter("limit", function(arr, limit) {
        if (!Array.isArray(arr)) return [];
        return arr.slice(0, limit);
    });

    return {
        dir: {
            input: "src",
            includes: "_includes",
            data: "_data",
            output: "."
        },
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: false
    };
};
