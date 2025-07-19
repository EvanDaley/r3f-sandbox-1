export function generateSimpleRandomChars(numChars = 4) {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excludes I, O, 0, 1 for clarity
    let result = '';
    for (let i = 0; i < numChars; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export function pickRandomName() {
    const names = [
        "Alice",
        "Bob",
        "Charlie",
        "David",
        "Eve",
        "Frank",
        "Grace",
        "Heidi",
        "Ivan",
        "Judy"
    ];

    const randomIndex = Math.floor(Math.random() * names.length);
    const randomName = names[randomIndex];

    return randomName;
}

