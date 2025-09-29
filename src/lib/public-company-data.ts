export const publicCompanyData = {
    tech: {
        name: 'SaaS / Technology',
        avgEmployees: 250,
        avgWebTraffic: 150000,
        revenuePerEmployee: 220000,
        baseRevenue: 5000000,
    },
    retail: {
        name: 'E-commerce / Retail',
        avgEmployees: 400,
        avgWebTraffic: 500000,
        revenuePerEmployee: 150000,
        baseRevenue: 10000000,
    },
    manufacturing: {
        name: 'Manufacturing',
        avgEmployees: 600,
        avgWebTraffic: 50000,
        revenuePerEmployee: 180000,
        baseRevenue: 20000000,
    },
    default: {
        name: 'General Business',
        avgEmployees: 350,
        avgWebTraffic: 100000,
        revenuePerEmployee: 190000,
        baseRevenue: 8000000,
    }
};

export type IndustryKey = keyof typeof publicCompanyData;
