export type FlohmarktTyp = 'Flohmarkt' | 'Fetzenmarkt' | 'Hausflohmarkt' | 'Antikmarkt';

export interface Flohmarkt {
  id: string;
  title: string;
  market_type: FlohmarktTyp;
  date: string;
  time_start: string;
  time_end: string;
  address: string;
  plz?: string | null;
  location_name: string;
  description: string;
  organizer_contact?: string | null;
  lat: number;
  lng: number;
  freigegeben: boolean;
  featured: boolean;
  created_at: string;
}

/** Used by the submission form (German field names = form-side, not DB) */
export interface FlohmarktFormData {
  titel: string;
  typ: FlohmarktTyp;
  datum: Date;
  uhrzeit_start: string;
  uhrzeit_ende: string;
  adresse: string;
  plz?: string;
  stadt: string;
  beschreibung: string;
  kontakt?: string;
}

export type FilterOption = 'alle' | 'heute' | 'wochenende' | 'naechste_woche';

export type Database = {
  public: {
    Tables: {
      fm_flea_markets: {
        Row: {
          id: string;
          title: string;
          market_type: FlohmarktTyp;
          date: string;
          time_start: string;
          time_end: string;
          address: string;
          plz: string | null;
          location_name: string;
          description: string;
          organizer_contact: string | null;
          lat: number;
          lng: number;
          freigegeben: boolean;
          featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          market_type: FlohmarktTyp;
          date: string;
          time_start?: string;
          time_end?: string;
          address?: string;
          plz?: string | null;
          location_name?: string;
          description?: string;
          organizer_contact?: string | null;
          lat?: number;
          lng?: number;
          freigegeben?: boolean;
          featured?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['fm_flea_markets']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
