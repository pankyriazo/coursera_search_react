const toCamelcase = (string: string) =>
    string
        .split(" ")
        .map((word: string) =>
            word
                .split("")
                .map((letter, index) =>
                    index === 0 ? letter.toUpperCase() : letter.toLowerCase()
                )
                .join("")
        )
        .join(" ");

export default toCamelcase;
