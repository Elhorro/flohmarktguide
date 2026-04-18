export type FlohmarktTyp = 'Flohmarkt' | 'Fetzenmarkt' | 'Hausflohmarkt' | 'Antikmarkt';

export interface Flohmarkt {
  id: string;
  titel: string;
  typ: FlohmarktTyp;
  datum: string;
  uhrzeit_start: string;
  uhrzeit_ende: string;
  adresse: string;
  stadt: string;
  beschreibung: string;
  kontakt?: string | null;
  lat: number;
  lng: number;
  freigegeben: boolean;
  erstellt_am: string;
}

export interface FlohmarktFormData {
  titel: string;
  typ: FlohmarktTyp;
  datum: Date;
  uhrzeit_start: string;
  uhrzeit_ende: string;
  adresse: string;
  stadt: string;
  beschreibung: string;
  kontakt?: string;
}

export type FilterOption = 'alle' | 'heute' | 'wochenende' | 'naechste_woche';
