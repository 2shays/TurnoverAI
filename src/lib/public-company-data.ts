
export type IndustryData = {
    name: string;
    avg_employees: number;
    avg_web_traffic: number;
    revenue_per_employee: number;
    base_revenue: number;
};

// This is the expected shape of the 'industry_benchmarks' table rows in Supabase.
export const publicCompanyData = {
    tech: {
        name: 'SaaS / Technology',
        avg_employees: 250,
        avg_web_traffic: 150000,
        revenue_per_employee: 220000,
        base_revenue: 5000000,
    },
    retail: {
        name: 'E-commerce / Retail',
        avg_employees: 400,
        avg_web_traffic: 500000,
        revenue_per_employee: 150000,
        base_revenue: 10000000,
    },
    manufacturing: {
        name: 'Manufacturing',
        avg_employees: 600,
        avg_web_traffic: 50000,
        revenue_per_employee: 180000,
        base_revenue: 20000000,
    },
    default: {
        name: 'General Business',
        avg_employees: 350,
        avg_web_traffic: 100000,
        revenue_per_employee: 190000,
        base_revenue: 8000000,
    }
};

export type IndustryKey = keyof typeof publicCompanyData;
