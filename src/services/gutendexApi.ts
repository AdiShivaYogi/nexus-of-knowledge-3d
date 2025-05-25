
export interface Book {
  id: number;
  title: string;
  authors: Array<{ name: string; birth_year?: number; death_year?: number }>;
  languages: string[];
  subjects: string[];
  formats: { [key: string]: string };
  download_count: number;
  copyright?: boolean;
}

export interface GutendexResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Book[];
}

class GutendexAPI {
  private baseURL = 'https://gutendx.com';

  async searchBooks(query: string, page: number = 1): Promise<GutendexResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}/books/?search=${encodeURIComponent(query)}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching books:', error);
      throw error;
    }
  }

  async getBooksBySubject(subject: string, page: number = 1): Promise<GutendexResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}/books/?topic=${encodeURIComponent(subject)}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching books by subject:', error);
      throw error;
    }
  }

  async getBookById(id: number): Promise<Book> {
    try {
      const response = await fetch(`${this.baseURL}/books/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching book by ID:', error);
      throw error;
    }
  }
}

export const gutendexApi = new GutendexAPI();

// Predefined collections
export const predefinedCollections = {
  literatura: {
    name: "Literatură Clasică",
    searchTerms: ["fiction", "literature", "novel"],
    subjects: ["literature", "fiction"]
  },
  stiinta: {
    name: "Știință & Tehnologie", 
    searchTerms: ["science", "technology", "physics", "mathematics"],
    subjects: ["science", "technology", "physics"]
  },
  istorie: {
    name: "Istorie & Filozofie",
    searchTerms: ["history", "philosophy", "political science"],
    subjects: ["history", "philosophy"]
  }
};
