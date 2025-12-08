declare module 'country-city' {
  export const Country: {
    getAllCountries(): Array<{ name: string; isoCode: string }>;
  };

  export const City: {
    getCities(countryName: string): string[];
  };
}
