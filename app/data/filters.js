const ALL_FILTERS = {
    "coffee-beans": [
        { id: 'cat', title: 'Category', options: ['Single', 'Two', 'Three', 'Multiple'] },
        { id: 'brew', title: 'Brew Method', options: ['Espresso', 'Filter', 'Milk-Based', 'Omni-Roast'] },
        { id: 'origin', title: 'Origin', options: ['Brazil', 'Colombia', 'El Salvador', 'Ethiopia', 'Indonesia'] },
        { id: 'process', title: 'Process', options: ['Washed', 'Natural', 'Honey'] },
    ],
    "capsules": [
        { id: 'cat', title: 'Category', options: ['Whole Bean', 'Ground', 'Coffee Capsules', 'Instant'] },
        { id: 'compatibility', title: 'Machine Compatibility', options: ['Nespresso Original', 'Nespresso Vertuo', 'Keurig K-Cup', 'Dolce Gusto', 'Reusable'] },
        { id: 'origin', title: 'Origin', options: ['Brazil', 'Colombia', 'El Salvador', 'Ethiopia', 'Indonesia'] },
        { id: 'process', title: 'Process', options: ['Washed', 'Natural', 'Honey', 'Decaf', 'Anaerobic'] },
    ],
    "drip-bags": [
        { id: 'cat', title: 'Category', options: ['Classic', 'Flavored', 'Decaf', 'Limited Edition'] },
        { id: 'compatibility', title: 'Machine Compatibility', options: ['Nespresso Original', 'Nespresso Vertuo', 'Dolce Gusto'] },
        { id: 'intensity', title: 'Intensity Level', options: ['Mild (1-4)', 'Medium (5-8)', 'Strong (9-12)'] },
        { id: 'origin', title: 'Origin', options: ['Brazil', 'Colombia', 'Ethiopia', 'Vietnam'] },
    ],
    "merchandise": [
        { id: 'type', title: 'Category', options: ['Apparel', 'Brewing Gear', 'Drinkware', 'Lifestyle'] },
        { id: 'collection', title: 'Collection', options: ['Monolith Series', 'Titan Axis', 'Studio Essentials'] },
        { id: 'size', title: 'Size', options: ['One Size', 'Small', 'Medium', 'Large', 'XL'] },
        { id: 'color', title: 'Palette', options: ['Obsidian Black', 'Chalk White', 'Sage Green', 'Raw Canvas'] },],
};

export function getFiltersByCategory(category) {
    return ALL_FILTERS[category] || [];
}