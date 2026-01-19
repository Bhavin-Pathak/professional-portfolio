// Calculates total professional experience starting from June 2022 (RnD Technosoft)
export const getTotalExperience = () => {
    const startDate = new Date("2022-06-01"); // Career started in June 2022 (RnD Technosoft)
    const today = new Date();

    let years = today.getFullYear() - startDate.getFullYear();
    let months = today.getMonth() - startDate.getMonth();

    if (months < 0) {
        years--;
        months += 12;
    }
    return `${years}.${months}+ Years of Expertise`;
};
