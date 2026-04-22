const ALL_PRODUCTS = {
    "coffee-beans": [
        { id: 'cb-0', slug: "indonesia-mariah-0", name: "Indonesia Mariah - Product 0", notes: "Citrus, nutty", price: "AED 60" },
        { id: 'cb-1', slug: "indonesia-mariah-1", name: "Indonesia Mariah - Product 1", notes: "Chocolate, berry", price: "AED 65" },
        { id: 'cb-2', slug: "indonesia-mariah-2", name: "Indonesia Mariah - Product 2", notes: "Caramel, nutty", price: "AED 60" },
        { id: 'cb-3', slug: "ethiopia-yirgacheffe", name: "Ethiopia Yirgacheffe", notes: "Floral, tea-like", price: "AED 75" },
        { id: 'cb-4', slug: "brazil-santos", name: "Brazil Santos Gold", notes: "Low acid, nutty", price: "AED 55" },
        { id: 'cb-5', slug: "colombia-huila", name: "Colombia Huila Reserve", notes: "Sweet, fruity", price: "AED 70" },
        { id: 'cb-6', slug: "el-salvador-honey", name: "El Salvador Honey Process", notes: "Honey, brown sugar", price: "AED 80" },
        { id: 'cb-7', slug: "indonesia-sumatra", name: "Sumatra Mandheling", notes: "Earthy, spicy", price: "AED 62" },
        { id: 'cb-8', slug: "guatemala-antigua", name: "Guatemala Antigua", notes: "Smoky, chocolate", price: "AED 68" },
    ],
    "capsules": [
        { id: 'cap-0', slug: "nespresso-original-0", name: "Nespresso Original 0 - Columbia Roast", notes: "Citrus, nutty, chocolate", price: "AED 55" },
        { id: 'cap-1', slug: "nespresso-original-1", name: "Nespresso Original 1 - Ethiopia Blend", notes: "Floral, berry, bright", price: "AED 65" },
        { id: 'cap-2', slug: "premium-pods-2", name: "Premium Pods 2 - Dark Italian Roast", notes: "Caramel, smoky, bold", price: "AED 70" },
        { id: 'cap-3', slug: "premium-pods-3", name: "Premium Pods 3 - Decaf Delight", notes: "Smooth, nutty, mild", price: "AED 58" },
        { id: 'cap-4', slug: "nespresso-original-4", name: "Nespresso Original 4 - Brazil Santos", notes: "Chocolate, hazelnut", price: "AED 62" },
        { id: 'cap-5', slug: "nespresso-original-5", name: "Nespresso Original 5- Lungo Forte", notes: "Strong, roasted, oaky", price: "AED 60" },
        { id: 'cap-6', slug: "premium-pods-6", name: "Premium Pods 6 - Vanilla Infusion", notes: "Sweet, creamy, vanilla", price: "AED 75" },
        { id: 'cap-7', slug: "premium-pods-7", name: "Premium Pods 7- Caramel Silk", notes: "Toffee, buttery, sweet", price: "AED 72" },
        { id: 'cap-8', slug: "nespresso-original-8", name: "Nespresso Original 8- Ristretto", notes: "Intense, spicy, fruity", price: "AED 68" },
    ],

    "drip-bags": [
        { id: 'cap-0', slug: "columbia-roast-capsules", name: "Columbia Roast Capsules", notes: "Stone fruit,honey jasmine", price: "AED 55" },
        { id: 'cap-1', slug: "ethiopia-blend-pods", name: "Ethiopia Blend Pods", notes: "Floral, berry, bright", price: "AED 65" },
        { id: 'cap-2', slug: "dark-italian-roast-pods", name: "Dark Italian Roast Pods", notes: "Caramel, smoky, bold", price: "AED 70" },
        { id: 'cap-3', slug: "decaf-delight-capsules", name: "Decaf Delight Capsules", notes: "Smooth, nutty, mild", price: "AED 58" },
        { id: 'cap-4', slug: "brazil-santos-pods", name: "Brazil Santos Pods", notes: "Chocolate, hazelnut", price: "AED 62" },
        { id: 'cap-5', slug: "lungo-forte-capsules", name: "Lungo Forte Capsules", notes: "Strong, roasted, oaky", price: "AED 60" },
        { id: 'cap-6', slug: "vanilla-infusion-pods", name: "Vanilla Infusion Pods", notes: "Sweet, creamy, vanilla", price: "AED 75" },
        { id: 'cap-7', slug: "caramel-silk-capsules", name: "Caramel Silk Capsules", notes: "Toffee, buttery, sweet", price: "AED 72" },
        { id: 'cap-8', slug: "ristretto-intense-pods", name: "Ristretto Intense Pods", notes: "Intense, spicy, fruity", price: "AED 68" },
    ],
    "merchandise": [
        { id: 'm-1', slug: "monolith-tee-black", name: "SURGE MONOLITH TEE", notes: "Heavyweight 300GSM Cotton, Boxy Fit", price: "AED 65" },
        { id: 'm-2', slug: "studio-essentials-hoodie", name: "STUDIO ESSENTIALS HOODIE", notes: "French Terry, Industrial Cut", price: "AED 70" },
        { id: 'm-3', slug: "titan-axis-cap", name: "TITAN AXIS CAP", notes: "Structured 6-Panel, Embroidered", price: "AED 95" },
        { id: 'm-4', slug: "monolith-tee-white", name: "SURGE MONOLITH TEE WHITE", notes: "Heavyweight 300GSM Cotton", price: "AED 55" },
        { id: 'm-5', slug: "brewing-gear-tote", name: "BREWING GEAR TOTE", notes: "Heavy Canvas, Reinforced Straps", price: "AED 75" },
        { id: 'm-6', slug: "studio-mug-industrial", name: "INDUSTRIAL STUDIO MUG", notes: "Matte Ceramic, 350ml", price: "AED 70" },
        { id: 'm-7', slug: "axis-socks-sage", name: "AXIS STUDIO SOCKS", notes: "Combed Cotton, Ribbed Knit", price: "AED 60" },
        { id: 'm-8', slug: "monolith-beanie", name: "MONOLITH BEANIE", notes: "Acrylic Knit, Double Cuff", price: "AED 65" },
        { id: 'm-9', slug: "lifestyle-sticker-pack", name: "STUDIO STICKER PACK", notes: "Vinyl, Weatherproof", price: "AED 75" },
    ],
};

export function getProductsByCategory(category) {
    return ALL_PRODUCTS[category] || [];
}