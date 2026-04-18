import { supabase } from './supabase';
import { Flohmarkt, FlohmarktFormData, FilterOption } from './types';

function getDateRange(filter: FilterOption): { from: string; to: string } | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (filter === 'heute') {
    const todayStr = today.toISOString().split('T')[0];
    return { from: todayStr, to: todayStr };
  }

  if (filter === 'wochenende') {
    const day = today.getDay();
    const diffToSat = (6 - day + 7) % 7;
    const sat = new Date(today);
    sat.setDate(today.getDate() + diffToSat);
    const sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);
    return {
      from: sat.toISOString().split('T')[0],
      to: sun.toISOString().split('T')[0],
    };
  }

  if (filter === 'naechste_woche') {
    const day = today.getDay();
    const diffToNextMon = ((1 - day + 7) % 7) + 7;
    const nextMon = new Date(today);
    nextMon.setDate(today.getDate() + diffToNextMon);
    const nextSun = new Date(nextMon);
    nextSun.setDate(nextMon.getDate() + 6);
    return {
      from: nextMon.toISOString().split('T')[0],
      to: nextSun.toISOString().split('T')[0],
    };
  }

  return null;
}

export async function getFlohmärkte(filter: FilterOption = 'alle'): Promise<Flohmarkt[]> {
  let query = supabase
    .from('flohmärkte')
    .select('*')
    .eq('freigegeben', true)
    .order('datum', { ascending: true });

  const range = getDateRange(filter);
  if (range) {
    query = query.gte('datum', range.from).lte('datum', range.to);
  } else {
    const today = new Date().toISOString().split('T')[0];
    query = query.gte('datum', today);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as Flohmarkt[]) || [];
}

export async function getNext10Flohmärkte(filter: FilterOption = 'alle'): Promise<Flohmarkt[]> {
  let query = supabase
    .from('flohmärkte')
    .select('*')
    .eq('freigegeben', true)
    .order('datum', { ascending: true });

  const range = getDateRange(filter);
  if (range) {
    query = query.gte('datum', range.from).lte('datum', range.to);
  } else {
    const today = new Date().toISOString().split('T')[0];
    query = query.gte('datum', today);
  }

  const { data, error } = await query.limit(10);
  if (error) throw error;
  return (data as Flohmarkt[]) || [];
}

export async function getFlohmarktById(id: string): Promise<Flohmarkt | null> {
  const { data, error } = await supabase
    .from('flohmärkte')
    .select('*')
    .eq('id', id)
    .eq('freigegeben', true)
    .maybeSingle();
  if (error) throw error;
  return data as Flohmarkt | null;
}

export async function getAlleFlohmärkte(): Promise<Flohmarkt[]> {
  const { data, error } = await supabase
    .from('flohmärkte')
    .select('*')
    .eq('freigegeben', true)
    .order('datum', { ascending: true });
  if (error) throw error;
  return (data as Flohmarkt[]) || [];
}

export async function createFlohmarkt(formData: FlohmarktFormData): Promise<void> {
  const { error } = await supabase.from('flohmärkte').insert([
    {
      titel: formData.titel,
      typ: formData.typ,
      datum: formData.datum.toISOString().split('T')[0],
      uhrzeit_start: formData.uhrzeit_start,
      uhrzeit_ende: formData.uhrzeit_ende,
      adresse: formData.adresse,
      stadt: formData.stadt,
      beschreibung: formData.beschreibung,
      kontakt: formData.kontakt || null,
      lat: 47.0707,
      lng: 15.4395,
      freigegeben: false,
    },
  ]);
  if (error) throw error;
}
